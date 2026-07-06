import { Schema, model, Model } from 'mongoose'
import { IPermission } from './permission.interface'

const permissionSchema = new Schema<IPermission>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    group: {
      type: String,
      trim: true,
    },
    module: {
      type: String,
      trim: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

permissionSchema.index({ group: 1 })

const Permission: Model<IPermission> = model<IPermission>(
  'Permission',
  permissionSchema,
)

export default Permission
