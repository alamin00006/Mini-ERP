import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'
import { PermissionService } from './permission.service'

/**
 * Creates a new permission
 * @param req - Express request object containing permission data
 * @param res - Express response object
  
 */
const createPermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await PermissionService.createPermission(req.body)
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Permission created successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves all permissions
 * @param req - Express request object
 * @param res - Express response object
  
 */
const getAllPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await PermissionService.getAllPermissions()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permissions retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves a permission by ID
 * @param req - Express request object with permission ID in params
 * @param res - Express response object
  
 */
const getPermissionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await PermissionService.getPermissionById(id as string)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permission retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Updates a permission by ID
 * @param req - Express request object with permission ID in params and update data in body
 * @param res - Express response object
  
 */
const updatePermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await PermissionService.updatePermission(
      id as string,
      req.body,
    )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permission updated successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Deletes a permission by ID
 * @param req - Express request object with permission ID in params
 * @param res - Express response object
  
 */
const deletePermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    await PermissionService.deletePermission(id as string)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Permission deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

export const PermissionController = {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
}
