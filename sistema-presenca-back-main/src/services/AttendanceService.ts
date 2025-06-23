import { Types } from 'mongoose';
import { Attendance } from '../models/Attendance';
import { Event } from '../models/Event';
import { User } from '../models/User';
import { AttendanceStatus } from '../enums/AttendanceStatus';
import { NotificationService } from '../services/NotificationService';
import { NotificationType } from '../enums/NotificationType';
import { RelatedToType } from '../enums/RelatedToType';
import { 
  MarkAttendanceDTO, 
  VerifyAttendanceDTO, 
  AttendanceFilterDTO,
  AttendanceReportDTO 
} from '../interfaces/attendance.interface';

function generateRandomCode(length: number = 6): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
}

export class AttendanceService {
  private notificationService: NotificationService;

  private async getUserInfo(userId: Types.ObjectId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return {
      id: user._id,
      name: user.name,
      email: user.email
    };
  }

  constructor() {
    this.notificationService = new NotificationService();
  }

  public async markAttendance(data: MarkAttendanceDTO) {
    try {
      // Verificar se o evento existe
      const event = await Event.findById(data.eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Verificar se o usuário está registrado no evento
      const isRegistered = event.attendees.some(a => a.userId.equals(data.userId));
      if (!isRegistered) {
        throw new Error('User is not registered for this event');
      }

      // Gerar código de verificação
      const verificationCode = generateRandomCode();

      // Registrar presença
      const attendance = await Attendance.create({
        ...data,
        verificationCode,
      });

      // Notificar usuário
      await this.notificationService.create({
        userId: data.userId,
        title: 'Attendance Marked',
        message: `Your attendance has been marked for event "${event.title}". Verification code: ${verificationCode}`,
        type: NotificationType.REMINDER,
        relatedTo: {
          type: RelatedToType.EVENT,
          id: event._id as Types.ObjectId
        }
      });

      return attendance;
    } catch (error) {
      throw error;
    }
  }

  public async verifyAttendance(data: VerifyAttendanceDTO) {
    try {
      const attendance = await Attendance.findOne({
        eventId: data.eventId,
        userId: data.userId,
        verificationCode: data.verificationCode,
      });

      if (!attendance) {
        throw new Error('Invalid verification code');
      }

      attendance.status = AttendanceStatus.PRESENT;
      attendance.verifiedAt = new Date();
      await attendance.save();

      return attendance;
    } catch (error) {
      throw error;
    }
  }

  public async syncAttendance(eventId: Types.ObjectId) {
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Marcar ausentes os que não registraram presença
      const attendances = await Attendance.find({ eventId });
      const presentUserIds = attendances.map(a => a.userId.toString());

      const absentAttendances = event.attendees
        .filter(a => !presentUserIds.includes(a.userId.toString()))
        .map(a => ({
          eventId,
          userId: a.userId,
          status: AttendanceStatus.ABSENT
        }));

      if (absentAttendances.length > 0) {
        await Attendance.insertMany(absentAttendances);
      }

      return await this.getAttendanceByEvent(eventId);
    } catch (error) {
      throw error;
    }
  }

  public async getAttendanceByEvent(eventId: Types.ObjectId) {
    try {
      return await Attendance.find({ eventId })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  public async getAttendanceByUser(userId: Types.ObjectId, filter?: AttendanceFilterDTO) {
    try {
      const query: any = { userId };

      if (filter?.status) {
        query.status = filter.status;
      }

      if (filter?.startDate || filter?.endDate) {
        query.createdAt = {};
        if (filter.startDate) query.createdAt.$gte = filter.startDate;
        if (filter.endDate) query.createdAt.$lte = filter.endDate;
      }

      return await Attendance.find(query)
        .populate('eventId', 'title startDate endDate')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  public async generateAttendanceReport(data: AttendanceReportDTO) {
    try {
      const attendances = await this.getAttendanceByEvent(data.eventId);
      const event = await Event.findById(data.eventId);

      if (!event) {
        throw new Error('Event not found');
      }

      // Aqui você pode implementar a geração do relatório no formato desejado
      // Por enquanto retornamos apenas os dados
      const report = {
        event: {
          title: event.title,
          date: event.startDate,
          location: event.location
        },
        attendances: await Promise.all(attendances.map(async a => ({
          user: await this.getUserInfo(a.userId),
          status: a.status,
          verifiedAt: a.verifiedAt,
          notes: data.includeNotes ? a.notes : undefined
        }))),
        summary: {
          total: attendances.length,
          present: attendances.filter(a => a.status === AttendanceStatus.PRESENT).length,
          absent: attendances.filter(a => a.status === AttendanceStatus.ABSENT).length,
          late: attendances.filter(a => a.status === AttendanceStatus.LATE).length,
          excused: attendances.filter(a => a.status === AttendanceStatus.EXCUSED).length
        }
      };

      return report;
    } catch (error) {
      throw error;
    }
  }
}
