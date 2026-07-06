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
exports.generateSKU = void 0;
const product_model_1 = __importDefault(require("../app/modules/product/product.model"));
/**
 * Generates a unique SKU (Stock Keeping Unit) for products
 * Format: PRD-000001, PRD-000002, etc.
 * @returns Promise<string> - Generated SKU
 */
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
exports.generateSKU = generateSKU;
