import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import sendResponse from '../../../shared/sendResponse'
import { SaleService } from './sale.service'

const createSale = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId
    const result = await SaleService.createSale({
      ...req.body,
      createdBy: userId,
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

export const SaleController = {
  createSale,
}
