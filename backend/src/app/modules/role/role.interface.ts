import { Document, Types } from 'mongoose';
import { IPermission } from '../permission/permission.interface';

export interface IRole extends Document {
  name: string;
  permissions: Types.ObjectId[] | IPermission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
