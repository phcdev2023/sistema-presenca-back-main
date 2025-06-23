import { Schema, model, Document, Types } from 'mongoose';
import { AttendanceStatus } from '../enums/AttendanceStatus';
import { CheckInMethod } from '../enums/CheckInMethod';

interface ILocation {
  lat: number;
  lng: number;
}

export interface IAttendance extends Document {
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
  status: AttendanceStatus;
  checkInMethod: CheckInMethod[];
  checkInTime: Date;
  location: ILocation;
  deviceInfo: Record<string, any>;
  synced: boolean;
  verificationCode?: string;
  verifiedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(AttendanceStatus),
    required: true,
  },
  checkInMethod: [{
    type: String,
    enum: Object.values(CheckInMethod),
    required: true,
  }],
  checkInTime: {
    type: Date,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  deviceInfo: {
    type: Schema.Types.Mixed,
    required: true,
  },
  synced: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  verifiedAt: {
    type: Date,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

// Índices para melhorar performance das consultas
attendanceSchema.index({ eventId: 1, userId: 1 }, { unique: true });
attendanceSchema.index({ verificationCode: 1 }, { unique: true, sparse: true });
attendanceSchema.index({ eventId: 1, status: 1 });
attendanceSchema.index({ userId: 1, status: 1 });

export const Attendance = model<IAttendance>('Attendance', attendanceSchema);
