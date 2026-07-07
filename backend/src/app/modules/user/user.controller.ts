import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'
import { UserService } from './user.service'

/**
 * Creates a new user
 * @param req - Express request object containing user data
 * @param res - Express response object
  
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
  
 */
const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await UserService.getUserById(id as string)
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
  
 */
const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await UserService.updateUser(id as string, req.body)
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
 * Toggles user active/inactive status
 * @param req - Express request object with user ID in params
 * @param res - Express response object
 */
const toggleUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await UserService.toggleUserStatus(id as string)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.isActive
        ? 'User activated successfully'
        : 'User deactivated successfully',
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
  toggleUserStatus,
}
