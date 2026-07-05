import { Document, Types } from 'mongoose';
import { IRole } from '../role/role.interface';
import { IPermission } from '../permission/permission.interface';

export interface IRolePermission extends Document {
  role: Types.ObjectId | IRole;
  permission: Types.ObjectId | IPermission;
  allowed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
