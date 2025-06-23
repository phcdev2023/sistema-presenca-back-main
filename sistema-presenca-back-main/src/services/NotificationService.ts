import { Types } from 'mongoose';
import admin from '../config/firebase';
import { Notification, INotification } from '../models/Notification';
import { User } from '../models/User';
import { NotificationType } from '../enums/NotificationType';
import { RelatedToType } from '../enums/RelatedToType';
import { IEvent } from '../models/Event';
import { IUser } from '../interfaces/user.interface';

interface CreateNotificationDTO {
  userId: Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  relatedTo: {
    type: RelatedToType;
    id: Types.ObjectId;
  };
}

export class NotificationService {
  /**
   * Envia lembretes para todos os participantes de um evento
   * @param event Evento para o qual enviar lembretes
   * @returns Array de notificações criadas
   */
  public async sendEventReminder(event: IEvent) {
    try {
      if (!event.attendees || event.attendees.length === 0) {
        console.log(`No attendees found for event ${event._id}`);
        return [];
      }

      const notifications = [];
      const eventStart = new Date(event.startDate);
      const now = new Date();
      const hoursUntilEvent = Math.floor((eventStart.getTime() - now.getTime()) / (1000 * 60 * 60));
      
      // Se o evento já começou, não envia notificação
      if (hoursUntilEvent < 0) {
        console.log(`Event ${event._id} has already started or is in the past`);
        return [];
      }

      // Formata a mensagem baseado em quanto tempo falta para o evento
      let timeMessage = '';
      if (hoursUntilEvent < 1) {
        const minutes = Math.floor((eventStart.getTime() - now.getTime()) / (1000 * 60));
        timeMessage = `em ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
      } else if (hoursUntilEvent < 24) {
        timeMessage = `em ${hoursUntilEvent} hora${hoursUntilEvent !== 1 ? 's' : ''}`;
      } else {
        const days = Math.ceil(hoursUntilEvent / 24);
        timeMessage = `em ${days} dia${days !== 1 ? 's' : ''}`;
      }

      for (const attendee of event.attendees) {
        try {
          const notification = await this.create({
            userId: attendee.userId,
            title: 'Lembrete de Evento',
            message: `O evento "${event.title}" começa ${timeMessage}!`,
            type: NotificationType.REMINDER,
            relatedTo: {
              type: RelatedToType.EVENT,
              id: event._id as Types.ObjectId
            }
          });
          notifications.push(notification);
        } catch (error) {
          console.error(`Error sending reminder to user ${attendee.userId} for event ${event._id}:`, error);
          // Continua para o próximo participante mesmo se um falhar
        }
      }

      return notifications;
    } catch (error) {
      console.error('Error in sendEventReminder:', error);
      throw new Error('Failed to send event reminders');
    }
  }

  /**
   * Envia confirmação de presença para um participante
   * @param userId ID do usuário
   * @param event Evento relacionado
   * @returns Notificação criada
   */
  public async sendAttendanceConfirmation(userId: Types.ObjectId, event: IEvent) {
    try {
      return await this.create({
        userId,
        title: 'Presença Confirmada',
        message: `Sua presença no evento "${event.title}" foi confirmada com sucesso!`,
        type: NotificationType.UPDATE,
        relatedTo: {
          type: RelatedToType.ATTENDANCE,
          id: event._id as Types.ObjectId
        }
      });
    } catch (error) {
      console.error(`Error sending attendance confirmation to user ${userId} for event ${event._id}:`, error);
      throw new Error('Failed to send attendance confirmation');
    }
  }

  /**
   * Envia uma notificação de atualização para um usuário
   * @param userId ID do usuário
   * @param event Evento relacionado
   * @param message Mensagem da notificação
   * @param type Tipo de notificação (padrão: UPDATE)
   * @returns Notificação criada
   */
  public async sendUpdateNotification(
    userId: Types.ObjectId, 
    event: IEvent, 
    message: string,
    type: NotificationType = NotificationType.UPDATE
  ) {
    try {
      return await this.create({
        userId,
        title: 'Atualização de Evento',
        message,
        type,
        relatedTo: {
          type: RelatedToType.EVENT,
          id: event._id as Types.ObjectId
        }
      });
    } catch (error) {
      console.error(`Error sending update notification to user ${userId} for event ${event._id}:`, error);
      throw new Error('Failed to send update notification');
    }
  }

  /**
   * Envia uma notificação para múltiplos usuários
   * @param userIds Array de IDs de usuários
   * @param title Título da notificação
   * @param message Mensagem da notificação
   * @param relatedTo Objeto relacionado (opcional)
   * @returns Array de notificações criadas
   */
  public async sendBulkNotification(
    userIds: Types.ObjectId[],
    title: string,
    message: string,
    relatedTo?: {
      type: RelatedToType;
      id: Types.ObjectId;
    }
  ) {
    try {
      const notifications = [];
      
      for (const userId of userIds) {
        try {
          const notification = await this.create({
            userId,
            title,
            message,
            type: NotificationType.ALERT,
            relatedTo: relatedTo || {
              type: RelatedToType.EVENT,
              id: new Types.ObjectId() // ID fictício para notificações sem relação direta
            }
          });
          notifications.push(notification);
        } catch (error) {
          console.error(`Error sending notification to user ${userId}:`, error);
          // Continua para o próximo usuário mesmo se um falhar
        }
      }

      return notifications;
    } catch (error) {
      console.error('Error in sendBulkNotification:', error);
      throw new Error('Failed to send bulk notifications');
    }
  }

  /**
   * Marca uma notificação como lida
   * @param notificationId ID da notificação
   * @returns Notificação atualizada
   */
  public async markAsRead(notificationId: Types.ObjectId) {
    try {
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { 
          read: true,
          readAt: new Date()
        },
        { new: true }
      );

      if (!notification) {
        throw new Error('Notificação não encontrada');
      }

      return notification;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw new Error('Falha ao marcar notificação como lida');
    }
  }

  /**
   * Cria uma nova notificação e envia via FCM se possível
   * @param notificationData Dados da notificação
   * @returns Notificação criada
   */
  public async create(notificationData: CreateNotificationDTO) {
    const session = await Notification.startSession();
    session.startTransaction();

    try {
      // 1. Salva a notificação no banco de dados
      const notification: INotification = await Notification.create([notificationData], { session });
      
      if (!notification || notification.length === 0) {
        throw new Error('Falha ao criar notificação');
      }
      
      const createdNotification = notification[0];
      
      // 2. Envia a notificação push via FCM em segundo plano (não bloqueia a resposta)
      this.sendPushNotification(createdNotification);
      
      await session.commitTransaction();
      session.endSession();
      
      return createdNotification;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Error creating notification:', error);
      throw new Error('Falha ao criar notificação');
    }
  }

  /**
   * Envia uma notificação push via FCM
   * @param notification Notificação a ser enviada
   */
  private async sendPushNotification(notification: INotification) {
    try {
      const user = await User.findById(notification.userId).select('fcmToken');
      
      if (!user || !user.fcmToken) {
        console.log(`User ${notification.userId} does not have an FCM token. Skipping push notification.`);
        return;
      }

      const payload = {
        notification: {
          title: notification.title,
          body: notification.message,
          // Ícone para Android (personalize conforme necessário)
          icon: 'ic_notification',
          // Cor para Android (formato #RRGGBB)
          color: '#2196F3',
          // Som para Android
          sound: 'default',
          // Badge para iOS (número de notificações não lidas)
          badge: '1',
        },
        data: {
          notificationId: notification._id.toString(),
          relatedToType: notification.relatedTo.type,
          relatedToId: notification.relatedTo.id.toString(),
          // Adiciona um timestamp para garantir que cada notificação seja única
          timestamp: new Date().toISOString(),
        },
        token: user.fcmToken,
        // Configurações de prioridade (high para notificações importantes)
        android: {
          priority: 'high',
          notification: {
            priority: 'high',
            defaultSound: true,
            defaultVibrateTimings: true,
          },
        },
        // Configurações para iOS
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      console.log(`Sending push notification to user ${user._id} with token ${user.fcmToken}`);
      const response = await admin.messaging().send(payload);
      console.log(`Successfully sent push notification to user ${user._id}:`, response);
      
      // Atualiza o status da notificação para enviada
      await Notification.findByIdAndUpdate(notification._id, { delivered: true });
      
    } catch (error) {
      console.error(`Failed to send push notification to user ${notification.userId}:`, error);
      
      // Se o token for inválido, remove-o do usuário
      if (error.code === 'messaging/registration-token-not-registered' ||
          error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/invalid-argument') {
        console.log(`Removing invalid FCM token for user ${notification.userId}`);
        await User.findByIdAndUpdate(notification.userId, { $unset: { fcmToken: 1 } });
      }
      
      // Atualiza o status da notificação para falha
      await Notification.findByIdAndUpdate(notification._id, { 
        deliveryError: error.message || 'Unknown error',
        delivered: false 
      });
    }
  }
}
