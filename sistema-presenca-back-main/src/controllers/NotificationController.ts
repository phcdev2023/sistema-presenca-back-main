import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Notification } from '../models/Notification';
import { NotificationService } from '../services/NotificationService';
import { Event } from '../models/Event';
import { NotificationType } from '../enums/NotificationType';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const notification = await this.notificationService.create(req.body);
      return res.status(201).json(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
      return res.status(400).json({ error: 'Error creating notification' });
    }
  };

  public getUserNotifications = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = Types.ObjectId.createFromHexString(req.params.userId);
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 });
      return res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(400).json({ error: 'Error fetching notifications' });
    }
  };

  public markAsRead = async (req: Request, res: Response): Promise<Response> => {
    try {
      const notificationId = Types.ObjectId.createFromHexString(req.params.id);
      const notification = await this.notificationService.markAsRead(notificationId);
      return res.json(notification);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return res.status(400).json({ error: 'Error updating notification' });
    }
  };

  public markAllAsRead = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = Types.ObjectId.createFromHexString(req.params.userId);
      const result = await Notification.updateMany(
        { userId, read: false },
        { 
          read: true,
          readAt: new Date()
        }
      );

      return res.json({ 
        modified: result.modifiedCount,
        message: 'Notifications marked as read'
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return res.status(400).json({ error: 'Error updating notifications' });
    }
  };

  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const notificationId = Types.ObjectId.createFromHexString(req.params.id);
      const notification = await Notification.findByIdAndDelete(notificationId);

      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      return res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      return res.status(400).json({ error: 'Error deleting notification' });
    }
  };

  public sendEventReminder = async (req: Request, res: Response): Promise<Response> => {
    try {
      const eventId = Types.ObjectId.createFromHexString(req.params.eventId);
      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const notifications = await this.notificationService.sendEventReminder(event);
      return res.status(201).json(notifications);
    } catch (error) {
      console.error('Error sending event reminder:', error);
      return res.status(400).json({ error: 'Error sending event reminder' });
    }
  };

  public sendAttendanceConfirmation = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId, eventId } = req.body;
      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const notification = await this.notificationService.sendAttendanceConfirmation(
        Types.ObjectId.createFromHexString(userId),
        event
      );
      return res.status(201).json(notification);
    } catch (error) {
      console.error('Error sending attendance confirmation:', error);
      return res.status(400).json({ error: 'Error sending attendance confirmation' });
    }
  };

  public sendUpdateNotification = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId, message, type } = req.body;
      const eventId = Types.ObjectId.createFromHexString(req.params.eventId);
      const event = await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }

      const notification = await this.notificationService.sendUpdateNotification(
        Types.ObjectId.createFromHexString(userId),
        event,
        message,
        type || NotificationType.UPDATE
      );
      return res.status(201).json(notification);
    } catch (error) {
      console.error('Erro ao enviar notificação de atualização:', error);
      return res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Erro ao enviar notificação de atualização' 
      });
    }
  }

  /**
   * Envia notificação para múltiplos usuários
   */
  public sendBulkNotification = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userIds, title, message, relatedTo } = req.body;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: 'Lista de usuários inválida' });
      }

      if (!title || !message) {
        return res.status(400).json({ error: 'Título e mensagem são obrigatórios' });
      }

      const notifications = await this.notificationService.sendBulkNotification(
        userIds.map((id: string) => Types.ObjectId.createFromHexString(id)),
        title,
        message,
        relatedTo
      );

      return res.status(201).json({
        success: true,
        sent: notifications.length,
        notifications
      });
    } catch (error) {
      console.error('Erro ao enviar notificações em massa:', error);
      return res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Erro ao enviar notificações em massa' 
      });
    }
  }

  /**
   * Obtém estatísticas de notificações
   */
  public getStats = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = Types.ObjectId.createFromHexString(req.params.userId);
      
      const [total, unread, delivered, failed] = await Promise.all([
        Notification.countDocuments({ userId }),
        Notification.countDocuments({ userId, read: false }),
        Notification.countDocuments({ userId, delivered: true }),
        Notification.countDocuments({ 
          userId, 
          delivered: false,
          deliveryError: { $exists: true, $ne: '' }
        })
      ]);

      return res.json({
        total,
        unread,
        delivered,
        failed
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas de notificações:', error);
      return res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Erro ao obter estatísticas' 
      });
    }
  };
}
