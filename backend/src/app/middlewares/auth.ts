import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import ApiError from '../../errors/ApiError'
import config from '../../config'

const auth =
  (...requiredRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Get token
      const authHeader = req.headers.authorization
      // console.log(authHeader)
      if (!authHeader) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
      }

      // If token comes as "Bearer token"
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader

      // 2. Verify token
      const decoded = jwt.verify(
        token,
        config.jwt.secret as string,
      ) as JwtPayload

      // 3. Attach user to request
      req.user = decoded

      // 4. Check roles (if any required)
      if (requiredRoles.length > 0) {
        if (!decoded.role || !requiredRoles.includes(decoded.role)) {
          throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden')
        }
      }

      next()
    } catch (err) {
      next(
        err instanceof ApiError
          ? err
          : new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'),
      )
    }
  }

export default auth
