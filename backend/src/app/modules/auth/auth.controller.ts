import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'
import { AuthService } from './auth.service'

/**
 * Handles user login authentication
 * @param req - Express request object containing user credentials
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    console.log(req.body)
    const result = await AuthService.loginUser(req.body)
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

export const AuthController = {
  loginUser,
}
