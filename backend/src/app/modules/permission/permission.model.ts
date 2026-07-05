import { Schema, model, Model } from 'mongoose';
import { IPermission } from './permission.interface';

const permissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    resource: {
      type: String,
      required: true,
      trim: true,
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

const Permission: Model<IPermission> = model<IPermission>('Permission', permissionSchema);

export default Permission;
