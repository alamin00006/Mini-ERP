import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import Product from '../product/product.model'
import Sale from '../sale/sale.model'

type TDashboardStats = {
  totalProducts: number
  totalSales: number
  lowStockProducts: number
}

const getDashboardStats = async (): Promise<TDashboardStats> => {
  const [totalProducts, totalSales, lowStockProducts] = await Promise.all([
    Product.countDocuments({ isDeleted: false }),
    Sale.countDocuments(),
    Product.countDocuments({ isDeleted: false, stockQuantity: { $lt: 5 } }),
  ])

  return {
    totalProducts,
    totalSales,
    lowStockProducts,
  }
}

export const DashboardService = {
  getDashboardStats,
}
