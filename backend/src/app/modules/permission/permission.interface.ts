import { Document } from 'mongoose';
export interface IPermission extends Document {
  name: string;
  resource: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
