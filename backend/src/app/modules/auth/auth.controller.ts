import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import sendResponse from '../../../shared/sendResponse'
import config from '../../../config'
import { AuthService } from './auth.service'

/**
 * Handles user login authentication
 * @param req - Express request object containing user credentials
 * @param res - Express response object
 */
const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await AuthService.loginUser(req.body)

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      secure: config.cookie.secure,
      httpOnly: config.cookie.httpOnly,
      sameSite: config.cookie.sameSite as 'lax' | 'strict' | 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })

    // Send refresh token in response body as well
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged in successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Refreshes access token using refresh token
 * @param req - Express request object containing refresh token
 * @param res - Express response object
 */
const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Get refresh token from cookie (since it's HTTP-only, client can't read it)
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token not found')
    }

    const result = await AuthService.refreshAccessToken(refreshToken)

    // Set new refresh token in HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      secure: config.cookie.secure,
      httpOnly: config.cookie.httpOnly,
      sameSite: config.cookie.sameSite as 'lax' | 'strict' | 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })

    // Send refresh token in response body as well
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Access token refreshed successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Logs out user by clearing refresh token
 * @param req - Express request object
 * @param res - Express response object
 */
const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Clear refresh token from database
    await AuthService.logoutUser(req.user?.userId as string)

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      secure: config.cookie.secure,
      httpOnly: config.cookie.httpOnly,
      sameSite: config.cookie.sameSite as 'lax' | 'strict' | 'none',
    })

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged out successfully',
      data: null,
    })
  } catch (error) {
    next(error)
  }
}

export const AuthController = {
  loginUser,
  refreshToken,
  logoutUser,
}
