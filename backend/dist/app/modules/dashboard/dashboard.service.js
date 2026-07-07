"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const product_model_1 = __importDefault(require("../product/product.model"));
const sale_model_1 = __importDefault(require("../sale/sale.model"));
/**
 * Retrieves dashboard statistics
 * @returns Promise<TDashboardStats> - Dashboard stats (total products, total sales, total sale amount, low stock count and products)
 */
const getDashboardStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalProducts, totalSalesResult, lowStockProducts] = yield Promise.all([
        product_model_1.default.countDocuments({ isDeleted: false }),
        sale_model_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$grandTotal' },
                    count: { $sum: 1 },
                },
            },
        ]),
        product_model_1.default.find({ isDeleted: false, stockQuantity: { $lt: 5 } })
            .select('_id name sku category stockQuantity')
            .lean(),
    ]);
    const totalSales = totalSalesResult.length > 0 ? totalSalesResult[0].count : 0;
    const totalSaleAmount = totalSalesResult.length > 0 ? totalSalesResult[0].totalAmount : 0;
    // Transform the products to match the expected frontend format
    const transformedLowStockProducts = lowStockProducts.map(product => ({
        _id: product._id.toString(),
        name: product.name,
        sku: product.sku,
        category: product.category.toString(),
        stockQuantity: product.stockQuantity,
    }));
    return {
        totalProducts,
        totalSales,
        totalSaleAmount,
        lowStockCount: transformedLowStockProducts.length,
        lowStockProducts: transformedLowStockProducts,
    };
});
exports.DashboardService = {
    getDashboardStats,
};
