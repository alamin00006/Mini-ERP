import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'
import { RoleService } from './role.service'

/**
 * Creates a new role
 * @param req - Express request object containing role data
 * @param res - Express response object
  
 */
const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await RoleService.createRole(req.body)
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Role created successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves all roles
 * @param req - Express request object
 * @param res - Express response object
  
 */
const getAllRoles = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await RoleService.getAllRoles()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Roles retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves a role by ID
 * @param req - Express request object with role ID in params
 * @param res - Express response object
  
 */
const getRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await RoleService.getRoleById(id as string)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Role retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Updates a role by ID
 * @param req - Express request object with role ID in params and update data in body
 * @param res - Express response object
  
 */
const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await RoleService.updateRole(id as string, req.body)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Role updated successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Deactivates a role by ID
 * @param req - Express request object with role ID in params
 * @param res - Express response object
  
 */
const deactivateRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await RoleService.deactivateRole(id as string)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Role deactivated successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Deletes a role by ID (hard delete)
 * @param req - Express request object with role ID in params
 * @param res - Express response object
  
 */
const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await RoleService.deleteRole(id as string)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    })
  } catch (error) {
    next(error)
  }
}

export const RoleController = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deactivateRole,
  deleteRole,
}
