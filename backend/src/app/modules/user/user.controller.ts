import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'
import { UserService } from './user.service'

/**
 * Creates a new user
 * @param req - Express request object containing user data
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await UserService.createUser(req.body)
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'User created successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves all users
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await UserService.getAllUsers()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves a user by ID
 * @param req - Express request object with user ID in params
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await UserService.getUserById(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Updates a user by ID
 * @param req - Express request object with user ID in params and update data in body
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await UserService.updateUser(id, req.body)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User updated successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Deactivates a user by ID
 * @param req - Express request object with user ID in params
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const deactivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await UserService.deactivateUser(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User deactivated successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const UserController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser,
}
