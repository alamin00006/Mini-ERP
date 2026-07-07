import { Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  isActive: boolean
  refreshToken?: string
  createdAt: Date
  updatedAt: Date
}
