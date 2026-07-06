import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import mongoose from 'mongoose'
import Product from '../product/product.model'
import Sale from './sale.model'

/**
 * Product details in a sale
 */
type TSaleProduct = {
  product: string
  quantity: number
  sellingPrice: number
  subtotal: number
}

/**
 * Response type for sale operations
 */
type TSaleResponse = {
  _id: string
  products: TSaleProduct[]
  grandTotal: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Creates a new sale transaction with stock management
 * Uses MongoDB transaction to ensure data consistency
 * @param payload - Sale creation data (products array and createdBy user ID)
 * @returns Promise<TSaleResponse> - Created sale data
 */
const createSale = async (payload: {
  products: { product: string; quantity: number }[]
  createdBy: string
}): Promise<TSaleResponse> => {
  const { products, createdBy } = payload

  if (!products || products.length === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'At least one product is required',
    )
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const saleProducts: TSaleProduct[] = []
    let grandTotal = 0

    for (const item of products) {
      const product = await Product.findById(item.product).session(session)
      if (!product) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          `Product not found: ${item.product}`,
        )
      }

      if (product.isDeleted) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Product is deleted: ${product.name}`,
        )
      }

      if (product.stockQuantity < item.quantity) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for product: ${product.name}. Available: ${product.stockQuantity}, Required: ${item.quantity}`,
        )
      }

      const sellingPrice = product.sellingPrice
      const subtotal = sellingPrice * item.quantity

      saleProducts.push({
        product: item.product,
        quantity: item.quantity,
        sellingPrice,
        subtotal,
      })

      grandTotal += subtotal

      await Product.findByIdAndUpdate(
        item.product,
        { stockQuantity: product.stockQuantity - item.quantity },
        { session },
      )
    }

    const sale = await Sale.create(
      [
        {
          products: saleProducts,
          grandTotal,
          createdBy,
        },
      ],
      { session },
    )

    await session.commitTransaction()
    session.endSession()

    return {
      _id: sale[0]._id.toString(),
      products: saleProducts,
      grandTotal,
      createdBy,
      createdAt: sale[0].createdAt,
      updatedAt: sale[0].updatedAt,
    }
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

export const SaleService = {
  createSale,
}
