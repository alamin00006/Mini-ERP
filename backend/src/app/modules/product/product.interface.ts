import { Document, Types } from 'mongoose'
import { ICategory } from '../category/category.interface'

export interface IProduct extends Document {
  name: string
  sku: string
  category: Types.ObjectId | ICategory
  purchasePrice: number
  sellingPrice: number
  stockQuantity: number
  image: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type TProductResponse = {
  _id: string
  name: string
  sku: string
  categoryId: string
  category: string
  purchasePrice: number
  sellingPrice: number
  stockQuantity: number
  image: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type TProductPayload = {
  name: string
  sku?: string
  category: string
  purchasePrice: number
  sellingPrice: number
  stockQuantity: number
  image: Express.Multer.File
}
