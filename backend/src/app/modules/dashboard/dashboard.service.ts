import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import Product from '../product/product.model'
import Sale from '../sale/sale.model'

/**
 * Dashboard statistics response type
 */
type TDashboardStats = {
  totalProducts: number
  totalSales: number
  totalSaleAmount: number
  lowStockCount: number
  lowStockProducts: Array<{
    _id: string
    name: string
    sku: string
    category: string
    stockQuantity: number
  }>
}

/**
 * Retrieves dashboard statistics
 * @returns Promise<TDashboardStats> - Dashboard stats (total products, total sales, total sale amount, low stock count and products)
 */
const getDashboardStats = async (): Promise<TDashboardStats> => {
  const [totalProducts, totalSalesResult, lowStockProducts] = await Promise.all(
    [
      Product.countDocuments({ isDeleted: false }),
      Sale.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$grandTotal' },
            count: { $sum: 1 },
          },
        },
      ]),
      Product.find({ isDeleted: false, stockQuantity: { $lt: 5 } })
        .select('_id name sku category stockQuantity')
        .lean(),
    ],
  )

  const totalSales = totalSalesResult.length > 0 ? totalSalesResult[0].count : 0
  const totalSaleAmount =
    totalSalesResult.length > 0 ? totalSalesResult[0].totalAmount : 0

  // Transform the products to match the expected frontend format
  const transformedLowStockProducts = lowStockProducts.map(product => ({
    _id: product._id.toString(),
    name: product.name,
    sku: product.sku,
    category: product.category.toString(),
    stockQuantity: product.stockQuantity,
  }))

  return {
    totalProducts,
    totalSales,
    totalSaleAmount,
    lowStockCount: transformedLowStockProducts.length,
    lowStockProducts: transformedLowStockProducts,
  }
}

export const DashboardService = {
  getDashboardStats,
}
