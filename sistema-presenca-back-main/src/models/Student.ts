import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email: string;
  registration: string;
}

const StudentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registration: { type: String, required: true, unique: true },
});

export const Student = mongoose.model<IStudent>('Student', StudentSchema);
