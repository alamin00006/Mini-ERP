import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import config from '../../../config'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import { comparePassword } from '../../../helpers/passwordHelpers'
import User from '../user/user.model'
import UserRole from '../userRole/userRole.model'
import Role from '../role/role.model'
import RolePermission from '../rolePermission/rolePermission.model'

/**
 * Response type for user login
 */
type TLoginResponse = {
  accessToken: string
  refreshToken?: string
  user: {
    userId: string
    email: string
    name: string
    role: string
    permissions: string[]
  }
}

/**
 * Authenticates user and generates access token
 * @param payload - User login credentials (email and password)
 * @returns Promise<TLoginResponse> - Access token and user information with permissions
 */
const loginUser = async (payload: {
  email: string
  password: string
}): Promise<TLoginResponse> => {
  const { email, password } = payload

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found')
  }

  const isPasswordMatched = await comparePassword(password, user.password)
  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect')
  }

  const userRole = await UserRole.findOne({ user: user._id }).populate('role')
  if (!userRole) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User role not found')
  }

  const role = userRole.role as any
  const rolePermissions = await RolePermission.find({
    role: role._id,
  }).populate('permission')

  const permissions = rolePermissions
    .filter((rp: any) => rp.permission && rp.allowed)
    .map((rp: any) => (rp.permission as any).key)

  const tokenPayload = {
    userId: user._id.toString(),
    roleId: role._id.toString(),
    roleName: role.name,
    permissions,
  }

  const accessToken = jwtHelpers.generateToken(tokenPayload)

  return {
    accessToken,
    user: {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: role.name,
      permissions,
    },
  }
}

export const AuthService = {
  loginUser,
}
