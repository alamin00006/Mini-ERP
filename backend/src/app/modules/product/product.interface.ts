import { Document, Types } from 'mongoose';
import { ICategory } from '../category/category.interface';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: Types.ObjectId | ICategory;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  image: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
