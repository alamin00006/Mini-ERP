import { Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  description?: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}
