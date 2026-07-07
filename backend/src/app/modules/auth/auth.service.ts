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
  refreshToken: string
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

  if (!user.isActive) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Your account is inactive. Please contact administrator.',
    )
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

  // Generate refresh token
  const refreshToken = jwtHelpers.generateRefreshToken({
    userId: user._id.toString(),
  })

  // Store refresh token in database
  await User.findByIdAndUpdate(user._id, {
    refreshToken,
  })

  return {
    accessToken,
    refreshToken,
    user: {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: role.name,
      permissions,
    },
  }
}

/**
 * Refreshes access token using refresh token
 * @param refreshToken - The refresh token
 * @returns Promise<TLoginResponse> - New access token and refresh token with user information
 */
const refreshAccessToken = async (
  refreshToken: string,
): Promise<TLoginResponse> => {
  try {
    // Verify refresh token
    const decoded = jwtHelpers.verifyRefreshToken<{ userId: string }>(
      refreshToken,
    )

    // Check if refresh token exists in database
    const user = await User.findOne({ refreshToken })
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token')
    }

    // Get user role and permissions
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

    // Generate new access token
    const newAccessToken = jwtHelpers.generateToken(tokenPayload)

    // Generate new refresh token
    const newRefreshToken = jwtHelpers.generateRefreshToken({
      userId: user._id.toString(),
    })

    // Update refresh token in database
    await User.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
    })

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: role.name,
        permissions,
      },
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Invalid or expired refresh token',
    )
  }
}

/**
 * Logs out user by clearing refresh token
 * @param userId - User ID to clear refresh token for
 */
const logoutUser = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    refreshToken: undefined,
  })
}

export const AuthService = {
  loginUser,
  refreshAccessToken,
  logoutUser,
}
