import { Types } from 'mongoose';
import { AttendanceStatus } from '../enums/AttendanceStatus';

export interface MarkAttendanceDTO {
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
  status: AttendanceStatus;
  verificationCode?: string;
  notes?: string;
}

export interface VerifyAttendanceDTO {
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
  verificationCode: string;
}

export interface AttendanceFilterDTO {
  eventId?: Types.ObjectId;
  userId?: Types.ObjectId;
  status?: AttendanceStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface AttendanceReportDTO {
  eventId: Types.ObjectId;
  format: 'pdf' | 'csv' | 'excel';
  includeNotes?: boolean;
}
