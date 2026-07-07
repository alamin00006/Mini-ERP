import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'
import { SaleService } from './sale.service'
import Sale from './sale.model'

/**
 * Creates a new sale transaction
 * @param req - Express request object containing sale data and user info from auth middleware
 * @param res - Express response object
  
 */
const createSale = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId
    const io = req.app.get('socketio')
    const result = await SaleService.createSale({
      ...req.body,
      createdBy: userId,
      io,
    })
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Sale created successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves all sales with pagination
 * @param req - Express request object
 * @param res - Express response object
  
 */
const getSales = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const [sales, total] = await Promise.all([
      Sale.find()
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Sale.countDocuments(),
    ])

    const totalPages = Math.ceil(total / limit)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Sales retrieved successfully',
      data: sales,
      meta: {
        page,
        limit,
        total,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const SaleController = {
  createSale,
  getSales,
}
