import { Document, Types } from 'mongoose'
import { ENUM_USER_ROLE } from '../../../enums/role'

// Enum for notification type
export enum ENUM_NOTIFICATION_TYPE {
  GENERAL = 'general',
  ALERT = 'alert',
  UPDATE = 'update',
  MESSAGE = 'message',
  INVESTMENT = 'investment',
}

// Enum for notification status
export enum ENUM_NOTIFICATION_STATUS {
  READ = 'read',
  UNREAD = 'unread',
}

// Interface for Notification document
export interface INotification extends Document {
  _id: Types.ObjectId;
  message: string;
  user?: Types.ObjectId;
  investment?: Types.ObjectId;
  project?: Types.ObjectId;
  adminUser?: Types.ObjectId[];
  roles: ENUM_USER_ROLE[];
  type: ENUM_NOTIFICATION_TYPE;
  status: ENUM_NOTIFICATION_STATUS;
  dismissed: boolean;
  timestamp: Date;
  readBy?: Types.ObjectId[];
}
