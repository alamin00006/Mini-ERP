import { Document } from 'mongoose';

export interface IPermission extends Document {
  key: string;
  name: string;
  description?: string;
  group?: string;
  module?: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}
