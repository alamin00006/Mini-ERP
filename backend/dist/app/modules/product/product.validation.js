"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductValidation = exports.createProductValidation = void 0;
const zod_1 = require("zod");
exports.createProductValidation = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    sku: zod_1.z.string().min(2, 'SKU must be at least 2 characters'),
    category: zod_1.z.string().min(1, 'Category is required'),
    purchasePrice: zod_1.z
        .number()
        .min(0, 'Purchase price must be greater than or equal to 0'),
    sellingPrice: zod_1.z
        .number()
        .min(0, 'Selling price must be greater than or equal to 0'),
    stockQuantity: zod_1.z
        .number()
        .min(0, 'Stock quantity must be greater than or equal to 0'),
});
exports.updateProductValidation = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
    sku: zod_1.z.string().min(2, 'SKU must be at least 2 characters').optional(),
    category: zod_1.z.string().min(1, 'Category is required').optional(),
    purchasePrice: zod_1.z
        .number()
        .min(0, 'Purchase price must be greater than or equal to 0')
        .optional(),
    sellingPrice: zod_1.z
        .number()
        .min(0, 'Selling price must be greater than or equal to 0')
        .optional(),
    stockQuantity: zod_1.z
        .number()
        .min(0, 'Stock quantity must be greater than or equal to 0')
        .optional(),
});
