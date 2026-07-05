"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSaleValidation = void 0;
const zod_1 = require("zod");
exports.createSaleValidation = zod_1.z.object({
    products: zod_1.z
        .array(zod_1.z.object({
        product: zod_1.z.string().min(1, 'Product is required'),
        quantity: zod_1.z.number().min(1, 'Quantity must be at least 1'),
    }))
        .min(1, 'At least one product is required'),
});
