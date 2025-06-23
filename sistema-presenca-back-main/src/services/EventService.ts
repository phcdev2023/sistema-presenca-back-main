import { Types } from 'mongoose';
import QRCode from 'qrcode';
import { Event } from '../models/Event';
import { CreateEventDTO, UpdateEventDTO, RegisterForEventDTO } from '../interfaces/event.interface';
import { NotificationService } from '../services/NotificationService';
import { NotificationType } from '../enums/NotificationType';
import { RelatedToType } from '../enums/RelatedToType';
import { AttendeeStatus } from '../enums/AttendeeStatus';

export class EventService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  private async generateUniqueQRCode(eventData: CreateEventDTO): Promise<string> {
    const timestamp = Date.now();
    const baseString = `${eventData.title}-${eventData.startDate}-${timestamp}`;
    const qrCodeData = baseString.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return qrCodeData;
  }

  public async createEvent(eventData: CreateEventDTO) {
    try {
      // Gerar QR code único
      const qrCodeData = await this.generateUniqueQRCode(eventData);

      // Adicionar o QR code aos dados do evento
      const eventWithQR = {
        ...eventData,
        qrCodeData
      };

      const event = await Event.create(eventWithQR);
      return event;
    } catch (error) {
      throw error;
    }
  }

  public async updateEvent(eventId: string, updateData: UpdateEventDTO) {
    try {
      const event = await Event.findByIdAndUpdate(
        eventId,
        { $set: updateData },
        { new: true }
      );

      if (!event) {
        throw new Error('Event not found');
      }

      // Notificar participantes sobre a atualização
      const attendees = event.attendees;
      for (const attendee of attendees) {
        await this.notificationService.create({
          userId: attendee.userId,
          title: 'Event Updated',
          message: `The event "${event.title}" has been updated`,
          type: NotificationType.UPDATE,
          relatedTo: {
            type: RelatedToType.EVENT,
            id: event._id as Types.ObjectId
          }
        });
      }

      return event;
    } catch (error) {
      throw error;
    }
  }

  public async deleteEvent(eventId: string) {
    try {
      const event = await Event.findByIdAndDelete(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Notificar participantes sobre o cancelamento
      const attendees = event.attendees;
      for (const attendee of attendees) {
        await this.notificationService.create({
          userId: attendee.userId,
          title: 'Event Cancelled',
          message: `The event "${event.title}" has been cancelled`,
          type: NotificationType.ALERT,
          relatedTo: {
            type: RelatedToType.EVENT,
            id: event._id as Types.ObjectId
          }
        });
      }

      return { message: 'Event deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  public async getEventById(eventId: string) {
    try {
      const event = await Event.findById(eventId)
        .populate('createdBy', 'name email')
        .populate('attendees.userId', 'name email');

      if (!event) {
        throw new Error('Event not found');
      }

      return event;
    } catch (error) {
      throw error;
    }
  }

  public async getAllEvents() {
    try {
      return await Event.find()
        .populate('createdBy', 'name email')
        .populate('attendees.userId', 'name email')
        .sort({ startDate: 1 });
    } catch (error) {
      throw error;
    }
  }

  public async getEventsByCreator(creatorId: string) {
    try {
      return await Event.find({ createdBy: creatorId })
        .populate('createdBy', 'name email')
        .populate('attendees.userId', 'name email')
        .sort({ startDate: 1 });
    } catch (error) {
      throw error;
    }
  }

  public async registerForEvent({ userId, eventId }: RegisterForEventDTO) {
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Verificar se já está registrado
      if (event.attendees.some(a => a.userId.equals(userId))) {
        throw new Error('User already registered for this event');
      }

      // Verificar limite de participantes
      if (event.maxParticipants && event.attendees.length >= event.maxParticipants) {
        // Adicionar à lista de espera
        event.waitingList.push({
          userId,
          registeredAt: new Date()
        });
        await event.save();
        throw new Error('Event is full, added to waiting list');
      }

      // Registrar participante
      event.attendees.push({
        userId,
        status: AttendeeStatus.REGISTERED
      });
      await event.save();

      // Enviar notificação de confirmação
      await this.notificationService.create({
        userId,
        title: 'Event Registration Confirmed',
        message: `You have successfully registered for "${event.title}"`,
        type: NotificationType.REMINDER,
        relatedTo: {
          type: RelatedToType.EVENT,
          id: event._id as Types.ObjectId
        }
      });

      return event;
    } catch (error) {
      throw error;
    }
  }

  public async generateQRCode(eventId: string) {
    try {
      const event = await this.getEventById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Gerar dados para o QR Code (pode incluir mais informações se necessário)
      const qrData = {
        eventId: event._id,
        title: event.title,
        date: event.startDate
      };

      // Gerar QR Code como string de dados URL
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData));
      return { qrCode: qrCodeDataUrl };
    } catch (error) {
      throw error;
    }
  }

  public async getAttendees(eventId: string) {
    try {
      const event = await Event.findById(eventId)
        .populate('attendees.userId', 'name email role');
      if (!event) {
        throw new Error('Event not found');
      }
      return event.attendees;
    } catch (error) {
      throw error;
    }
  }
}
