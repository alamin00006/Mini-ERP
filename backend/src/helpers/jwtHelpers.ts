import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import httpStatus from 'http-status'
import ApiError from '../errors/ApiError'
import config from '../config'
import { IJwtPayload } from '../app/modules/clientRegistration/user.interface'

const generateToken = (payload: IJwtPayload): string => {
  try {
    if (!config.jwt.secret || !config.jwt.expires_in) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'JWT configuration is missing',
      )
    }

    const secret: Secret = config.jwt.secret

    const options: SignOptions = {
      expiresIn: config.jwt.expires_in as SignOptions['expiresIn'],
    }

    return jwt.sign(payload, secret, options)
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to generate token: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    )
  }
}

const verifyToken = <T>(token: string): T => {
  try {
    if (!config.jwt.secret) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'JWT secret missing')
    }

    return jwt.verify(token, config.jwt.secret) as T
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token')
  }
}

export const jwtHelpers = {
  generateToken,
  verifyToken,
}
