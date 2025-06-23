import admin from 'firebase-admin';
import { User } from '../models/User';
import { Types } from 'mongoose';
import { logger } from '../utils/logger';

export class FcmService {
  /**
   * Atualiza o token FCM de um usuário
   */
  public async updateFcmToken(userId: Types.ObjectId, fcmToken: string): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, { $set: { fcmToken } });
    } catch (error) {
      console.error('Erro ao atualizar token FCM:', error);
      throw new Error('Falha ao atualizar token FCM');
    }
  }

  /**
   * Remove um token FCM de um usuário
   */
  public async removeFcmToken(userId: Types.ObjectId): Promise<void> {
    try {
      await User.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
    } catch (error) {
      console.error('Erro ao remover token FCM:', error);
      throw new Error('Falha ao remover token FCM');
    }
  }

  /**
   * Verifica se um token FCM é válido
   */
  private isFirebaseInitialized(): void {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin SDK não foi inicializado. Chame initializeFirebase() primeiro.');
    }
  }

  public async isTokenValid(fcmToken: string): Promise<boolean> {
    if (!fcmToken || typeof fcmToken !== 'string') {
      logger.warn('Token FCM inválido fornecido para validação');
      return false;
    }

    try {
      this.isFirebaseInitialized();
      
      // Tenta enviar uma mensagem de teste para validar o token
      await admin.messaging().send({
        token: fcmToken,
        notification: {
          title: 'Validação de Token',
          body: 'Validando token FCM...'
        },
        android: {
          priority: 'high',
          ttl: 3600 * 1000 // 1 hora
        },
        apns: {
          headers: {
            'apns-priority': '10',
            'apns-push-type': 'background',
            'apns-topic': 'com.your.app' // Substitua pelo seu bundle ID
          },
          payload: {
            aps: {
              contentAvailable: true,
              priority: 'high',
              'mutable-content': 1
            }
          }
        }
      }, true); // dryRun: true - não envia a mensagem, apenas valida o token
      
      logger.debug(`Token FCM válido: ${fcmToken.substring(0, 10)}...`);
      return true;
    } catch (error: any) {
      // Códigos de erro do FCM para tokens inválidos
      const invalidTokenErrors = [
        'messaging/registration-token-not-registered',
        'messaging/invalid-registration-token',
        'messaging/invalid-argument',
        'messaging/mismatched-credential',
        'messaging/sender-id-mismatch',
        'messaging/configuration-not-found',
        'messaging/third-party-auth-error'
      ];

      if (error.code && invalidTokenErrors.includes(error.code)) {
        logger.warn(`Token FCM inválido (${error.code}): ${fcmToken.substring(0, 10)}...`);
        return false;
      }
      
      // Log detalhado do erro inesperado
      logger.error('Erro ao validar token FCM:', { 
        error: error.message || 'Erro desconhecido',
        code: error.code || 'no-code',
        stack: error.stack
      });
      
      // Em caso de erro na API, assumir que o token é válido para evitar falsos positivos
      return true;
    }
  }

  /**
   * Remove tokens FCM inválidos do banco de dados
   */
  private cleanupInProgress = false;
  private lastCleanup = new Date(0);
  private readonly CLEANUP_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutos

  public async cleanupInvalidTokens(): Promise<{ total: number; removed: number }> {
    try {
      // Previne execuções paralelas
      if (this.cleanupInProgress) {
        logger.warn('Limpeza de tokens FCM já em andamento');
        throw new Error('Limpeza de tokens já está em andamento');
      }

      // Verifica cooldown
      const now = new Date();
      if (now.getTime() - this.lastCleanup.getTime() < this.CLEANUP_COOLDOWN_MS) {
        const minutesLeft = Math.ceil(
          (this.CLEANUP_COOLDOWN_MS - (now.getTime() - this.lastCleanup.getTime())) / (60 * 1000)
        );
        logger.warn(`Aguarde ${minutesLeft} minutos antes de executar outra limpeza`);
        throw new Error(`Aguarde ${minutesLeft} minutos antes de executar outra limpeza`);
      }

      this.cleanupInProgress = true;
      logger.info('Iniciando limpeza de tokens FCM inválidos...');

      // Busca usuários em lotes para evitar sobrecarga de memória
      const batchSize = 100;
      let offset = 0;
      let totalProcessed = 0;
      let removedCount = 0;

      while (true) {
        const users = await User.find({ fcmToken: { $exists: true } })
          .select('_id fcmToken')
          .skip(offset)
          .limit(batchSize)
          .lean();

        if (users.length === 0) break;

        // Processa os usuários em paralelo com limitação de concorrência
        const results = await Promise.allSettled(
          users.map(user => 
            this.isTokenValid(user.fcmToken!)
              .then(isValid => ({ userId: user._id, isValid }))
              .catch(() => ({ userId: user._id, isValid: true })) // Em caso de erro, mantém o token
          )
        );

        // Remove tokens inválidos
        const invalidTokens = results
          .filter((result): result is PromiseFulfilledResult<{userId: Types.ObjectId, isValid: boolean}> => 
            result.status === 'fulfilled' && !result.value.isValid
          )
          .map(result => result.value.userId);

        if (invalidTokens.length > 0) {
          await User.updateMany(
            { _id: { $in: invalidTokens } },
            { $unset: { fcmToken: 1 } }
          );
          removedCount += invalidTokens.length;
        }

        totalProcessed += users.length;
        offset += batchSize;
        
        // Pequena pausa para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      this.lastCleanup = new Date();
      logger.info(`Limpeza concluída. Processados: ${totalProcessed}, Removidos: ${removedCount}`);
      
      return {
        total: totalProcessed,
        removed: removedCount
      };
    } catch (error) {
      logger.error('Erro durante a limpeza de tokens FCM:', error);
      throw new Error(`Falha ao limpar tokens FCM inválidos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      this.cleanupInProgress = false;
    }
  }
}

export const fcmService = new FcmService();
