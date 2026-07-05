"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const saleProductSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { _id: false });
const saleSchema = new mongoose_1.Schema({
    products: {
        type: [saleProductSchema],
        required: true,
    },
    grandTotal: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
const Sale = (0, mongoose_1.model)('Sale', saleSchema);
exports.default = Sale;
