import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { AttendanceService } from '../services/AttendanceService';
import { AttendanceStatus } from '../enums/AttendanceStatus';

export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  public markAttendance = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { eventId: eventIdStr, userId: userIdStr, status, notes } = req.body;
      const eventId = Types.ObjectId.createFromHexString(eventIdStr);
      const userId = Types.ObjectId.createFromHexString(userIdStr);

      const attendance = await this.attendanceService.markAttendance({
        eventId,
        userId,
        status: status as AttendanceStatus,
        notes
      });

      return res.status(201).json(attendance);
    } catch (error) {
      console.error('Error marking attendance:', error);
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Error marking attendance' });
    }
  };

  public verifyAttendance = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { eventId: eventIdStr, userId: userIdStr, verificationCode } = req.body;
      const eventId = Types.ObjectId.createFromHexString(eventIdStr);
      const userId = Types.ObjectId.createFromHexString(userIdStr);

      const attendance = await this.attendanceService.verifyAttendance({
        eventId,
        userId,
        verificationCode
      });

      return res.json(attendance);
    } catch (error) {
      console.error('Error verifying attendance:', error);
      return res.status(400).json({ error: error instanceof Error ? error.message : 'Error verifying attendance' });
    }
  };

  public syncAttendance = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { eventId: eventIdStr } = req.params;
      const eventId = Types.ObjectId.createFromHexString(eventIdStr);

      const attendances = await this.attendanceService.syncAttendance(eventId);
      return res.json(attendances);
    } catch (error) {
      console.error('Error syncing attendance:', error);
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Error syncing attendance' });
    }
  };

  public getEventAttendance = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { eventId: eventIdStr } = req.params;
      const eventId = Types.ObjectId.createFromHexString(eventIdStr);

      const attendances = await this.attendanceService.getAttendanceByEvent(eventId);
      return res.json(attendances);
    } catch (error) {
      console.error('Error fetching event attendance:', error);
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Error fetching attendance records' });
    }
  };

  public getUserAttendance = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId: userIdStr } = req.params;
      const { status, startDate, endDate } = req.query;
      const userId = Types.ObjectId.createFromHexString(userIdStr);

      const filter = {
        status: status as AttendanceStatus,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      };

      const attendances = await this.attendanceService.getAttendanceByUser(userId, filter);
      return res.json(attendances);
    } catch (error) {
      console.error('Error fetching user attendance:', error);
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Error fetching attendance records' });
    }
  };

  public generateReport = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { eventId: eventIdStr } = req.params;
      const { format, includeNotes } = req.query;
      const eventId = Types.ObjectId.createFromHexString(eventIdStr);

      const report = await this.attendanceService.generateAttendanceReport({
        eventId,
        format: format as 'pdf' | 'csv' | 'excel',
        includeNotes: includeNotes === 'true'
      });

      return res.json(report);
    } catch (error) {
      console.error('Error generating attendance report:', error);
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Error generating report' });
    }
  };

}
