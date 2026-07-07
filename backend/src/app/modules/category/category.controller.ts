import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import sendResponse from '../../../shared/sendResponse'
import { CategoryService } from './category.service'

/**
 * Creates a new category
 * @param req - Express request object containing category data
 * @param res - Express response object
  
 */
const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await CategoryService.createCategory(req.body)
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Category created successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves all categories
 * @param req - Express request object
 * @param res - Express response object
  
 */
const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await CategoryService.getAllCategories()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Categories retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Retrieves a category by ID
 * @param req - Express request object with category ID in params
 * @param res - Express response object
  
 */
const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await CategoryService.getCategoryById(id as string)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Category retrieved successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Updates a category by ID
 * @param req - Express request object with category ID in params and update data in body
 * @param res - Express response object
  
 */
const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params
    const result = await CategoryService.updateCategory(id as string, req.body)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Category updated successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const CategoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
}
