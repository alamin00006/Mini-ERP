import { Schema, model, Model } from 'mongoose'
import { IRole } from './role.interface'

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Virtual populate for rolePermissions
roleSchema.virtual('rolePermissions', {
  ref: 'RolePermission',
  localField: '_id',
  foreignField: 'role',
})

const Role: Model<IRole> = model<IRole>('Role', roleSchema)

export default Role
