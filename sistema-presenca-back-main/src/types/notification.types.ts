import { Types } from 'mongoose';
import { NotificationType } from '../enums/NotificationType';

export type RelatedToType = 'event' | 'attendance' | 'user' | 'system';

export interface IRelatedTo {
  type: RelatedToType;
  id: Types.ObjectId;
  name?: string;
  metadata?: Record<string, any>;
}

export interface INotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  clickAction?: string;
  priority?: 'high' | 'normal';
  ttl?: number;
}

export interface INotificationOptions {
  type?: NotificationType;
  relatedTo?: IRelatedTo;
  silent?: boolean;
  priority?: 'high' | 'normal';
  scheduledAt?: Date;
  data?: Record<string, any>;
}

export interface IBulkNotificationOptions extends Omit<INotificationOptions, 'relatedTo'> {
  relatedTo?: {
    type: RelatedToType;
    id: string | Types.ObjectId;
    name?: string;
    metadata?: Record<string, any>;
  };
}
