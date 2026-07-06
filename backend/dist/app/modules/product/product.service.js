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
exports.ProductService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const r2Upload_1 = require("../../../helpers/r2Upload");
const product_model_1 = __importDefault(require("./product.model"));
const category_model_1 = __importDefault(require("../category/category.model"));
const generateSKU = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastProduct = yield product_model_1.default.findOne().sort({ createdAt: -1 });
    const prefix = 'PRD';
    if (!lastProduct) {
        return `${prefix}-000001`;
    }
    const lastSKU = lastProduct.sku;
    const match = lastSKU.match(/^PRD-(\d+)$/);
    if (match) {
        const lastNumber = parseInt(match[1], 10);
        const nextNumber = lastNumber + 1;
        return `${prefix}-${String(nextNumber).padStart(6, '0')}`;
    }
    return `${prefix}-000001`;
});
const createProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, sku, category, purchasePrice, sellingPrice, stockQuantity, image, } = payload;
    const finalSKU = sku || (yield generateSKU());
    const existingProduct = yield product_model_1.default.findOne({ sku: finalSKU });
    if (existingProduct) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Product with this SKU already exists');
    }
    const categoryExists = yield category_model_1.default.findById(category);
    if (!categoryExists) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Category not found');
    }
    const imageUrl = yield (0, r2Upload_1.uploadToR2)(image, 'products');
    const product = yield product_model_1.default.create({
        name,
        sku: finalSKU,
        category,
        purchasePrice,
        sellingPrice,
        stockQuantity,
        image: imageUrl,
    });
    const populatedProduct = yield product_model_1.default.findById(product._id).populate('category');
    return {
        _id: product._id.toString(),
        name: product.name,
        sku: product.sku,
        category: ((_a = populatedProduct.category) === null || _a === void 0 ? void 0 : _a.name) || category,
        purchasePrice: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        stockQuantity: product.stockQuantity,
        image: product.image,
        isDeleted: product.isDeleted,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
});
const getAllProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', category, } = query;
    const productQuery = { isDeleted: false };
    if (search) {
        ;
        productQuery.$or = [
            { name: { $regex: search, $options: 'i' } },
            { sku: { $regex: search, $options: 'i' } },
        ];
    }
    if (category) {
        ;
        productQuery.category = category;
    }
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const [data, total] = yield Promise.all([
        product_model_1.default.find(productQuery)
            .populate('category')
            .sort(sort)
            .skip(skip)
            .limit(limit),
        product_model_1.default.countDocuments(productQuery),
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
        data: data.map(product => {
            var _a;
            return ({
                _id: product._id.toString(),
                name: product.name,
                sku: product.sku,
                category: ((_a = product.category) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
                purchasePrice: product.purchasePrice,
                sellingPrice: product.sellingPrice,
                stockQuantity: product.stockQuantity,
                image: product.image,
                isDeleted: product.isDeleted,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
            });
        }),
        meta: {
            page,
            limit,
            total,
            totalPages,
        },
    };
});
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const product = yield product_model_1.default.findOne({ _id: id, isDeleted: false }).populate('category');
    if (!product) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    return {
        _id: product._id.toString(),
        name: product.name,
        sku: product.sku,
        category: ((_a = product.category) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
        purchasePrice: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        stockQuantity: product.stockQuantity,
        image: product.image,
        isDeleted: product.isDeleted,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
});
const updateProduct = (id, payload, image) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    if (product.isDeleted) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Product is deleted');
    }
    if (payload.sku && payload.sku !== product.sku) {
        const existingProduct = yield product_model_1.default.findOne({ sku: payload.sku });
        if (existingProduct) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Product with this SKU already exists');
        }
    }
    if (payload.category) {
        const categoryExists = yield category_model_1.default.findById(payload.category);
        if (!categoryExists) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Category not found');
        }
    }
    let imageUrl = product.image;
    if (image) {
        if (product.image) {
            yield (0, r2Upload_1.deleteFromR2)(product.image);
        }
        imageUrl = yield (0, r2Upload_1.uploadToR2)(image, 'products');
    }
    const updatedProduct = yield product_model_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, payload), { image: imageUrl }), { new: true });
    const populatedProduct = yield product_model_1.default.findById(id).populate('category');
    return {
        _id: updatedProduct._id.toString(),
        name: updatedProduct.name,
        sku: updatedProduct.sku,
        category: ((_a = populatedProduct.category) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown',
        purchasePrice: updatedProduct.purchasePrice,
        sellingPrice: updatedProduct.sellingPrice,
        stockQuantity: updatedProduct.stockQuantity,
        image: updatedProduct.image,
        isDeleted: updatedProduct.isDeleted,
        createdAt: updatedProduct.createdAt,
        updatedAt: updatedProduct.updatedAt,
    };
});
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    if (product.isDeleted) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Product is already deleted');
    }
    yield product_model_1.default.findByIdAndUpdate(id, { isDeleted: true });
});
exports.ProductService = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
