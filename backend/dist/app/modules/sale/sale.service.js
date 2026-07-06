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
exports.SaleService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = __importDefault(require("../product/product.model"));
const sale_model_1 = __importDefault(require("./sale.model"));
/**
 * Creates a new sale transaction with stock management
 * Uses MongoDB transaction to ensure data consistency
 * @param payload - Sale creation data (products array and createdBy user ID)
 * @returns Promise<TSaleResponse> - Created sale data
 */
const createSale = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { products, createdBy } = payload;
    if (!products || products.length === 0) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'At least one product is required');
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const saleProducts = [];
        let grandTotal = 0;
        for (const item of products) {
            const product = yield product_model_1.default.findById(item.product).session(session);
            if (!product) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, `Product not found: ${item.product}`);
            }
            if (product.isDeleted) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Product is deleted: ${product.name}`);
            }
            if (product.stockQuantity < item.quantity) {
                throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Insufficient stock for product: ${product.name}. Available: ${product.stockQuantity}, Required: ${item.quantity}`);
            }
            const sellingPrice = product.sellingPrice;
            const subtotal = sellingPrice * item.quantity;
            saleProducts.push({
                product: item.product,
                quantity: item.quantity,
                sellingPrice,
                subtotal,
            });
            grandTotal += subtotal;
            yield product_model_1.default.findByIdAndUpdate(item.product, { stockQuantity: product.stockQuantity - item.quantity }, { session });
        }
        const sale = yield sale_model_1.default.create([
            {
                products: saleProducts,
                grandTotal,
                createdBy,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return {
            _id: sale[0]._id.toString(),
            products: saleProducts,
            grandTotal,
            createdBy,
            createdAt: sale[0].createdAt,
            updatedAt: sale[0].updatedAt,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.SaleService = {
    createSale,
};
