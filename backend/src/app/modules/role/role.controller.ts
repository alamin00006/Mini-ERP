import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'
import { RoleService } from './role.service'

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

const getRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await RoleService.getRoleById(id)
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

const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await RoleService.updateRole(id, req.body)
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

const deactivateRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await RoleService.deactivateRole(id)
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

export const RoleController = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deactivateRole,
}
