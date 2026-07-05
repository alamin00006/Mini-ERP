import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { uploadToR2, deleteFromR2 } from '../../../helpers/r2Upload'
import Product from './product.model'
import Category from '../category/category.model'
import type { Multer } from 'multer'

type TProductResponse = {
  _id: string
  name: string
  sku: string
  category: string
  purchasePrice: number
  sellingPrice: number
  stockQuantity: number
  image: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

const createProduct = async (payload: {
  name: string
  sku: string
  category: string
  purchasePrice: number
  sellingPrice: number
  stockQuantity: number
  image: Express.Multer.File
}): Promise<TProductResponse> => {
  const {
    name,
    sku,
    category,
    purchasePrice,
    sellingPrice,
    stockQuantity,
    image,
  } = payload

  const existingProduct = await Product.findOne({ sku })
  if (existingProduct) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Product with this SKU already exists',
    )
  }

  const categoryExists = await Category.findById(category)
  if (!categoryExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category not found')
  }

  const imageUrl = await uploadToR2(image, 'products')

  const product = await Product.create({
    name,
    sku,
    category,
    purchasePrice,
    sellingPrice,
    stockQuantity,
    image: imageUrl,
  })

  const populatedProduct = await Product.findById(product._id).populate(
    'category',
  )

  return {
    _id: product._id.toString(),
    name: product.name,
    sku: product.sku,
    category: (populatedProduct as any).category?.name || category,
    purchasePrice: product.purchasePrice,
    sellingPrice: product.sellingPrice,
    stockQuantity: product.stockQuantity,
    image: product.image,
    isDeleted: product.isDeleted,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

const getAllProducts = async (query: {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  category?: string
}): Promise<{ data: TProductResponse[]; meta: any }> => {
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    category,
  } = query

  const productQuery = { isDeleted: false }

  if (search) {
    ;(productQuery as any).$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ]
  }

  if (category) {
    ;(productQuery as any).category = category
  }

  const skip = (page - 1) * limit
  const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 }

  const [data, total] = await Promise.all([
    Product.find(productQuery)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(productQuery),
  ])

  const totalPages = Math.ceil(total / limit)

  return {
    data: data.map(product => ({
      _id: product._id.toString(),
      name: product.name,
      sku: product.sku,
      category: (product as any).category?.name || 'Unknown',
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      stockQuantity: product.stockQuantity,
      image: product.image,
      isDeleted: product.isDeleted,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    })),
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  }
}

const getProductById = async (id: string): Promise<TProductResponse> => {
  const product = await Product.findOne({ _id: id, isDeleted: false }).populate(
    'category',
  )

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found')
  }

  return {
    _id: product._id.toString(),
    name: product.name,
    sku: product.sku,
    category: (product as any).category?.name || 'Unknown',
    purchasePrice: product.purchasePrice,
    sellingPrice: product.sellingPrice,
    stockQuantity: product.stockQuantity,
    image: product.image,
    isDeleted: product.isDeleted,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

const updateProduct = async (
  id: string,
  payload: Partial<{
    name: string
    sku: string
    category: string
    purchasePrice: number
    sellingPrice: number
    stockQuantity: number
  }>,
  image?: Express.Multer.File,
): Promise<TProductResponse> => {
  const product = await Product.findById(id)
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found')
  }

  if (product.isDeleted) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product is deleted')
  }

  if (payload.sku && payload.sku !== product.sku) {
    const existingProduct = await Product.findOne({ sku: payload.sku })
    if (existingProduct) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Product with this SKU already exists',
      )
    }
  }

  if (payload.category) {
    const categoryExists = await Category.findById(payload.category)
    if (!categoryExists) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Category not found')
    }
  }

  let imageUrl = product.image
  if (image) {
    if (product.image) {
      await deleteFromR2(product.image)
    }
    imageUrl = await uploadToR2(image, 'products')
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { ...payload, image: imageUrl },
    { new: true },
  )

  const populatedProduct = await Product.findById(id).populate('category')

  return {
    _id: updatedProduct!._id.toString(),
    name: updatedProduct!.name,
    sku: updatedProduct!.sku,
    category: (populatedProduct as any).category?.name || 'Unknown',
    purchasePrice: updatedProduct!.purchasePrice,
    sellingPrice: updatedProduct!.sellingPrice,
    stockQuantity: updatedProduct!.stockQuantity,
    image: updatedProduct!.image,
    isDeleted: updatedProduct!.isDeleted,
    createdAt: updatedProduct!.createdAt,
    updatedAt: updatedProduct!.updatedAt,
  }
}

const deleteProduct = async (id: string): Promise<void> => {
  const product = await Product.findById(id)
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found')
  }

  if (product.isDeleted) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product is already deleted')
  }

  await Product.findByIdAndUpdate(id, { isDeleted: true })
}

export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
}
