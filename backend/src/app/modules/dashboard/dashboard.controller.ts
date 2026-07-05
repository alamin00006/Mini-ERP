import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'
import { DashboardService } from './dashboard.service'

const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await DashboardService.getDashboardStats()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const DashboardController = {
  getDashboardStats,
}
