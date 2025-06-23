import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { fcmService } from '../services/FcmService';
import { UpdateFcmTokenDTO } from '../interfaces/user.interface';
import { logger } from '../utils/logger';

export class FcmController {
  /**
   * Atualiza o token FCM do usuário
   */
  public updateFcmToken = async (req: Request, res: Response): Promise<Response> => {
    const startTime = Date.now();
    const { userId } = req.params;
    
    try {
      if (!Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID de usuário inválido' 
        });
      }

      const { fcmToken } = req.body as UpdateFcmTokenDTO;
      if (!fcmToken) {
        return res.status(400).json({ 
          success: false, 
          error: 'Token FCM é obrigatório' 
        });
      }

      const userIdObj = new Types.ObjectId(userId);
      await fcmService.updateFcmToken(userIdObj, fcmToken);
      
      logger.info('Token FCM atualizado com sucesso', { 
        userId,
        durationMs: Date.now() - startTime 
      });
      
      return res.json({ 
        success: true, 
        message: 'Token FCM atualizado com sucesso' 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      logger.error('Erro ao atualizar token FCM', { 
        userId,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        durationMs: Date.now() - startTime
      });
      
      const statusCode = errorMessage.includes('não encontrado') ? 404 : 500;
      return res.status(statusCode).json({ 
        success: false, 
        error: errorMessage 
      });
    }
  };

  /**
   * Remove o token FCM do usuário (logout)
   */
  public removeFcmToken = async (req: Request, res: Response): Promise<Response> => {
    const startTime = Date.now();
    const { userId } = req.params;
    
    try {
      if (!Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID de usuário inválido' 
        });
      }

      const userIdObj = new Types.ObjectId(userId);
      await fcmService.removeFcmToken(userIdObj);
      
      logger.info('Token FCM removido com sucesso', { 
        userId,
        durationMs: Date.now() - startTime 
      });
      
      return res.json({ 
        success: true, 
        message: 'Token FCM removido com sucesso' 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      logger.error('Erro ao remover token FCM', { 
        userId,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        durationMs: Date.now() - startTime
      });
      
      const statusCode = errorMessage.includes('não encontrado') ? 404 : 500;
      return res.status(statusCode).json({ 
        success: false, 
        error: errorMessage 
      });
    }
  };

  /**
   * Limpa tokens FCM inválidos do banco de dados (rota administrativa)
   */
  public cleanupInvalidTokens = async (req: Request, res: Response): Promise<Response> => {
    const startTime = Date.now();
    
    try {
      logger.info('Iniciando limpeza de tokens FCM inválidos');
      
      const result = await fcmService.cleanupInvalidTokens();
      
      logger.info('Limpeza de tokens FCM concluída com sucesso', { 
        total: result.total,
        removed: result.removed,
        durationMs: Date.now() - startTime 
      });
      
      return res.json({
        success: true,
        message: 'Limpeza de tokens FCM concluída',
        data: result
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      logger.error('Erro ao limpar tokens FCM inválidos', { 
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        durationMs: Date.now() - startTime
      });
      
      return res.status(500).json({
        success: false,
        error: errorMessage
      });
    }
  };
}

export const fcmController = new FcmController();
