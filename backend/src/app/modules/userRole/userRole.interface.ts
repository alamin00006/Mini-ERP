import { Document, Types } from 'mongoose';
import { IRole } from '../role/role.interface';
import { IUser } from '../user/user.interface';

export interface IUserRole extends Document {
  user: Types.ObjectId | IUser;
  role: Types.ObjectId | IRole;
  createdAt: Date;
  updatedAt: Date;
}
