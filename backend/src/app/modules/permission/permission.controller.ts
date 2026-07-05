import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'
import { PermissionService } from './permission.service'

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

const getPermissionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await PermissionService.getPermissionById(id)
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

const updatePermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await PermissionService.updatePermission(id, req.body)
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

const deletePermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    await PermissionService.deletePermission(id)
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
