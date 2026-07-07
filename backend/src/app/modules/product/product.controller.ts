import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import sendResponse from '../../../shared/sendResponse'
import { ProductService } from './product.service'

/**
 * Creates a new product with image upload
 * @param req - Express request object containing product data and image file
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const file = req.file
    if (!file) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Product image is required')
    }

    const result = await ProductService.createProduct({
      ...req.body,
      image: file,
    })
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Product created successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves all products with pagination, search, and filtering
 * @param req - Express request object with query parameters (page, limit, search, sortBy, sortOrder, category)
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, search, sortBy, sortOrder, category } = req.query
    const result = await ProductService.getAllProducts({
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
      category: category as string,
    })
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Products retrieved successfully',
      data: result.data,
      meta: result.meta,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves a product by ID
 * @param req - Express request object with product ID in params
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await ProductService.getProductById(id as string)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Updates a product by ID with optional image upload
 * @param req - Express request object with product ID in params, update data in body, and optional image file
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const file = req.file
    const result = await ProductService.updateProduct(
      id as string,
      req.body,
      file,
    )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product updated successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Deletes a product by ID (soft delete)
 * @param req - Express request object with product ID in params
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    await ProductService.deleteProduct(id as string)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
}
