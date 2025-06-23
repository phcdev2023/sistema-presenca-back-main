import { Types } from 'mongoose';
import PDFDocument from 'pdfkit';
import { Event } from '../models/Event';
import { User } from '../models/User';
import { Attendance } from '../models/Attendance';
import { AttendanceStatus } from '../enums/AttendanceStatus';
import { AttendanceService } from './AttendanceService';

interface ReportOptions {
  format?: 'pdf' | 'csv' | 'excel';
  includeNotes?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export class ReportService {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  public async generateEventReport(eventId: Types.ObjectId, options: ReportOptions = {}) {
    try {
      const event = await Event.findById(eventId)
        .populate('createdBy', 'name email')
        .populate('attendees.userId', 'name email role');

      if (!event) {
        throw new Error('Event not found');
      }

      const attendances = await this.attendanceService.getAttendanceByEvent(eventId);

      const report = {
        event: {
          title: event.title,
          description: event.description,
          date: event.startDate,
          location: event.location,
          createdBy: event.createdBy
        },
        statistics: {
          totalRegistered: event.attendees.length,
          totalPresent: attendances.filter(a => a.status === AttendanceStatus.PRESENT).length,
          totalAbsent: attendances.filter(a => a.status === AttendanceStatus.ABSENT).length,
          totalLate: attendances.filter(a => a.status === AttendanceStatus.LATE).length,
          totalExcused: attendances.filter(a => a.status === AttendanceStatus.EXCUSED).length
        },
        attendances: attendances.map(a => ({
          user: a.userId,
          status: a.status,
          verifiedAt: a.verifiedAt,
          notes: options.includeNotes ? a.notes : undefined
        }))
      };

      if (options.format === 'pdf') {
        return await this.exportToPDF(report);
      }

      return report;
    } catch (error) {
      throw error;
    }
  }

  public async generateUserAttendanceReport(userId: Types.ObjectId, options: ReportOptions = {}) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const query: any = { userId };
      if (options.startDate || options.endDate) {
        query.createdAt = {};
        if (options.startDate) query.createdAt.$gte = options.startDate;
        if (options.endDate) query.createdAt.$lte = options.endDate;
      }

      const attendances = await Attendance.find(query)
        .populate('eventId', 'title description startDate location')
        .sort({ createdAt: -1 });

      const report = {
        user: {
          name: user.name,
          email: user.email,
          course: user.course,
          registration: user.registration
        },
        period: {
          startDate: options.startDate,
          endDate: options.endDate
        },
        statistics: {
          totalEvents: attendances.length,
          present: attendances.filter(a => a.status === AttendanceStatus.PRESENT).length,
          absent: attendances.filter(a => a.status === AttendanceStatus.ABSENT).length,
          late: attendances.filter(a => a.status === AttendanceStatus.LATE).length,
          excused: attendances.filter(a => a.status === AttendanceStatus.EXCUSED).length
        },
        attendances: attendances.map(a => ({
          event: a.eventId,
          status: a.status,
          verifiedAt: a.verifiedAt,
          notes: options.includeNotes ? a.notes : undefined
        }))
      };

      if (options.format === 'pdf') {
        return await this.exportToPDF(report);
      }

      return report;
    } catch (error) {
      throw error;
    }
  }

  private async exportToPDF(data: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const chunks: Buffer[] = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Cabeçalho
        doc.fontSize(20).text('Attendance Report', { align: 'center' });
        doc.moveDown();

        // Informações do evento/usuário
        if (data.event) {
          doc.fontSize(16).text('Event Information');
          doc.fontSize(12)
            .text(`Title: ${data.event.title}`)
            .text(`Date: ${data.event.date.toLocaleDateString()}`)
            .text(`Location: ${data.event.location.name}`);
        } else if (data.user) {
          doc.fontSize(16).text('User Information');
          doc.fontSize(12)
            .text(`Name: ${data.user.name}`)
            .text(`Email: ${data.user.email}`)
            .text(`Course: ${data.user.course}`);
        }

        doc.moveDown();

        // Estatísticas
        doc.fontSize(16).text('Statistics');
        Object.entries(data.statistics).forEach(([key, value]) => {
          doc.fontSize(12).text(`${key}: ${value}`);
        });

        doc.moveDown();

        // Lista de presenças
        doc.fontSize(16).text('Attendance List');
        data.attendances.forEach((attendance: any) => {
          doc.fontSize(12)
            .text('-------------------')
            .text(`Status: ${attendance.status}`)
            .text(`Verified At: ${attendance.verifiedAt?.toLocaleDateString() || 'N/A'}`);
          
          if (attendance.notes) {
            doc.text(`Notes: ${attendance.notes}`);
          }
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
