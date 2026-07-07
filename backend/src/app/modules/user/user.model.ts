import { Schema, model, Model } from 'mongoose'
import { IUser } from './user.interface'

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  },
)

// Virtual populate for userRoles
userSchema.virtual('userRoles', {
  ref: 'UserRole',
  localField: '_id',
  foreignField: 'user',
})

const User: Model<IUser> = model<IUser>('User', userSchema)

export default User
