import { Schema, model, Model } from 'mongoose';
import { IUserRole } from './userRole.interface';

const userRoleSchema = new Schema<IUserRole>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userRoleSchema.index({ user: 1, role: 1 }, { unique: true });
userRoleSchema.index({ user: 1 });
userRoleSchema.index({ role: 1 });

const UserRole: Model<IUserRole> = model<IUserRole>('UserRole', userRoleSchema);

export default UserRole;
