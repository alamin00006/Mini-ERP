import { Schema, model, Model, Types } from 'mongoose';
import { ISale, ISaleProduct } from './sale.interface';
import { IProduct } from '../product/product.interface';
import { IUser } from '../user/user.interface';

const saleProductSchema = new Schema<ISaleProduct>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const saleSchema = new Schema<ISale>(
  {
    products: {
      type: [saleProductSchema],
      required: true,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sale: Model<ISale> = model<ISale>('Sale', saleSchema);

export default Sale;
