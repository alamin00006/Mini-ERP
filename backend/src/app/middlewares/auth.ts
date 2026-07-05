import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import ApiError from '../../errors/ApiError'
import config from '../../config'
import User from '../../app/modules/user/user.model'
import Role from '../../app/modules/role/role.model'
import Permission from '../../app/modules/permission/permission.model'
import UserRole from '../../app/modules/userRole/userRole.model'
import RolePermission from '../../app/modules/rolePermission/rolePermission.model'

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader

    if (!config.jwt.secret) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'JWT secret is not configured',
      )
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload

    const user = await User.findById(decoded.userId)
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found')
    }

    const userRole = await UserRole.findOne({ user: user._id }).populate('role')
    if (!userRole) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User role not found')
    }

    const role = userRole.role as any
    const rolePermissions = await RolePermission.find({
      role: role._id,
    }).populate('permission')

    const permissions = rolePermissions
      .filter((rp: any) => rp.permission && rp.allowed)
      .map((rp: any) => (rp.permission as any).key)

    req.user = {
      userId: user._id.toString(),
      roleId: role._id.toString(),
      roleName: role.name,
      permissions,
    }

    next()
  } catch (err) {
    if (err instanceof ApiError) {
      next(err)
    } else {
      next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'))
    }
  }
}

export const authorize = (...requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = req.user as any

      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
      }

      if (user.roleName === 'Admin') {
        return next()
      }

      const hasPermission = requiredPermissions.some(permission =>
        user.permissions.includes(permission),
      )

      if (!hasPermission) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'You do not have permission to access this resource',
        )
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}
