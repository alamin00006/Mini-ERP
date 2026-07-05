import { Document, Types } from 'mongoose';
import { IProduct } from '../product/product.interface';
import { IUser } from '../user/user.interface';

export interface ISaleProduct {
  product: Types.ObjectId | IProduct;
  quantity: number;
  sellingPrice: number;
  subtotal: number;
}

export interface ISale extends Document {
  products: ISaleProduct[];
  grandTotal: number;
  createdBy: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}
