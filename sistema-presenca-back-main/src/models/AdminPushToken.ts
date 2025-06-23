import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminPushToken extends Document {
  adminId?: string;
  token: string;
}

const AdminPushTokenSchema = new Schema<IAdminPushToken>({
  adminId: { type: String }, // Opcional: relacione com o admin se desejar
  token: { type: String, required: true, unique: true },
});

export default mongoose.model<IAdminPushToken>('AdminPushToken', AdminPushTokenSchema);
