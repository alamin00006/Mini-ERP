import { Schema, model, Model, Types } from 'mongoose';
import { IRole } from './role.interface';
import { IPermission } from '../permission/permission.interface';

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    permissions: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Role: Model<IRole> = model<IRole>('Role', roleSchema);

export default Role;
