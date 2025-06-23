import { Schema, model, Document } from 'mongoose';
import { UserRole } from '../enums/UserRole';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  course: string;
  registration: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  fcmToken?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  acceptedTerms: boolean;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // nunca retorna senha por padrão
  },
  course: {
    type: String,
    required: true,
  },
  registration: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: Object.values(UserRole),
    default: UserRole.ALUNO
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  fcmToken: {
    type: String,
    required: false,
  },
  acceptedTerms: {
    type: Boolean,
    required: true,
    default: false,
  },
  googleAccessToken: {
    type: String,
    required: false,
  },
  googleRefreshToken: {
    type: String,
    required: false,
  },
  anonymized: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

// Índices customizados para performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ registration: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Hash de senha antes de salvar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as any);
  }
});

// Remover senha do retorno JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model<IUser>('User', userSchema);
