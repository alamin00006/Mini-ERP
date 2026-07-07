import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import Category from './category.model'
import type { ICategory } from './category.interface'

/**
 * Response type for category operations
 */
type TCategoryResponse = {
  _id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Creates a new category
 * @param payload - Category creation data (name, description, isActive)
 * @returns Promise<TCategoryResponse> - Created category data
 */
const createCategory = async (payload: {
  name: string
  description?: string
  isActive?: boolean
}): Promise<TCategoryResponse> => {
  const { name, description, isActive } = payload

  const existingCategory = await Category.findOne({ name })
  if (existingCategory) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Category with this name already exists',
    )
  }

  const category = await Category.create({
    name,
    description,
    isActive: isActive ?? true,
  })

  return {
    _id: category._id.toString(),
    name: category.name,
    description: category.description,
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  }
}

/**
 * Retrieves all categories
 * @returns Promise<TCategoryResponse[]> - List of all categories
 */
const getAllCategories = async (): Promise<TCategoryResponse[]> => {
  const categories = await Category.find().sort({ createdAt: -1 })

  return categories.map(category => ({
    _id: category._id.toString(),
    name: category.name,
    description: category.description,
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  }))
}

/**
 * Retrieves a category by ID
 * @param id - Category ID
 * @returns Promise<TCategoryResponse> - Category data
 */
const getCategoryById = async (id: string): Promise<TCategoryResponse> => {
  const category = await Category.findById(id)

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found')
  }

  return {
    _id: category._id.toString(),
    name: category.name,
    description: category.description,
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  }
}

/**
 * Updates a category by ID
 * @param id - Category ID to update
 * @param payload - Partial category data to update
 * @returns Promise<TCategoryResponse> - Updated category data
 */
const updateCategory = async (
  id: string,
  payload: Partial<{
    name: string
    description: string
    isActive: boolean
  }>,
): Promise<TCategoryResponse> => {
  const category = await Category.findById(id)
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found')
  }

  if (payload.name && payload.name !== category.name) {
    const existingCategory = await Category.findOne({ name: payload.name })
    if (existingCategory) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Category with this name already exists',
      )
    }
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { ...payload },
    { new: true },
  )

  return {
    _id: updatedCategory!._id.toString(),
    name: updatedCategory!.name,
    description: updatedCategory!.description,
    isActive: updatedCategory!.isActive,
    createdAt: updatedCategory!.createdAt,
    updatedAt: updatedCategory!.updatedAt,
  }
}

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
}
