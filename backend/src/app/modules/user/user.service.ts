import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { hashPassword } from '../../../helpers/passwordHelpers'
import User from './user.model'
import UserRole from '../userRole/userRole.model'
import Role from '../role/role.model'

/**
 * Response type for user operations
 */
type TUserResponse = {
  _id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Creates a new user with hashed password and assigned role
 * @param payload - User creation data (name, email, password, role)
 * @returns Promise<TUserResponse> - Created user data
 */
const createUser = async (payload: {
  name: string
  email: string
  password: string
  role: string
}): Promise<TUserResponse> => {
  const { name, email, password, role } = payload

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'User with this email already exists',
    )
  }

  const hashedPassword = await hashPassword(password)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  const roleDoc = await Role.findOne({ name: role })
  if (!roleDoc) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role not found')
  }

  await UserRole.create({
    user: user._id,
    role: roleDoc._id,
  })

  const populatedUser = await User.findById(user._id).populate({
    path: 'userRoles',
    populate: {
      path: 'role',
    },
  })

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: roleDoc.name,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

/**
 * Retrieves all users with their roles
 * @returns Promise<TUserResponse[]> - Array of all users
 */
const getAllUsers = async (): Promise<TUserResponse[]> => {
  const users = await User.find().populate({
    path: 'userRoles',
    populate: {
      path: 'role',
    },
  })

  return users.map(user => {
    const userRole = (user as any).userRoles?.[0]
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: userRole?.role?.name || 'No Role',
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  })
}

/**
 * Retrieves a user by ID with populated role
 * @param id - User ID
 * @returns Promise<TUserResponse> - User data
 */
const getUserById = async (id: string): Promise<TUserResponse> => {
  const user = await User.findById(id).populate({
    path: 'userRoles',
    populate: {
      path: 'role',
    },
  })

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  const userRole = (user as any).userRoles?.[0]

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: userRole?.role?.name || 'No Role',
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

/**
 * Updates a user by ID
 * @param id - User ID to update
 * @param payload - Partial user data to update
 * @returns Promise<TUserResponse> - Updated user data
 */
const updateUser = async (
  id: string,
  payload: Partial<{
    name: string
    email: string
    password: string
    role: string
    isActive: boolean
  }>,
): Promise<TUserResponse> => {
  const user = await User.findById(id)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  if (payload.email && payload.email !== user.email) {
    const existingUser = await User.findOne({ email: payload.email })
    if (existingUser) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'User with this email already exists',
      )
    }
  }

  if (payload.password) {
    payload.password = await hashPassword(payload.password)
  }

  const updatedUser = await User.findByIdAndUpdate(id, payload, { new: true })

  if (payload.role) {
    const roleDoc = await Role.findOne({ name: payload.role })
    if (roleDoc) {
      await UserRole.findOneAndUpdate(
        { user: id },
        { role: roleDoc._id },
        { new: true, upsert: true },
      )
    }
  }

  const userRole = await UserRole.findOne({ user: id }).populate('role')

  return {
    _id: updatedUser!._id.toString(),
    name: updatedUser!.name,
    email: updatedUser!.email,
    role: (userRole?.role as any)?.name || 'No Role',
    isActive: updatedUser!.isActive,
    createdAt: updatedUser!.createdAt,
    updatedAt: updatedUser!.updatedAt,
  }
}

/**
 * Deactivates a user by ID (soft delete)
 * @param id - User ID to deactivate
 * @returns Promise<TUserResponse> - Deactivated user data
 */
const deactivateUser = async (id: string): Promise<TUserResponse> => {
  const user = await User.findById(id)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  const deactivatedUser = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  )

  const userRole = await UserRole.findOne({ user: id }).populate('role')

  return {
    _id: deactivatedUser!._id.toString(),
    name: deactivatedUser!.name,
    email: deactivatedUser!.email,
    role: (userRole?.role as any)?.name || 'No Role',
    isActive: deactivatedUser!.isActive,
    createdAt: deactivatedUser!.createdAt,
    updatedAt: deactivatedUser!.updatedAt,
  }
}

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser,
}
