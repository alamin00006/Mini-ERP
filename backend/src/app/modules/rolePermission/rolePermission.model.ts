import { Schema, model, Model } from 'mongoose'
import { IRolePermission } from './rolePermission.interface'

const rolePermissionSchema = new Schema<IRolePermission>(
  {
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    permission: {
      type: Schema.Types.ObjectId,
      ref: 'Permission',
      required: true,
    },
    allowed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

rolePermissionSchema.index({ role: 1, permission: 1 }, { unique: true })
rolePermissionSchema.index({ role: 1 })
rolePermissionSchema.index({ permission: 1 })

const RolePermission: Model<IRolePermission> = model<IRolePermission>(
  'RolePermission',
  rolePermissionSchema,
)

export default RolePermission
