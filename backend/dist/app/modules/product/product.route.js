"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const product_validation_1 = require("./product.validation");
const auth_1 = require("../../middlewares/auth");
const multer_1 = require("../../middlewares/multer");
const router = (0, express_1.Router)();
router.post('/', auth_1.auth, (0, auth_1.authorize)('product.create'), (0, multer_1.uploadSingle)('image'), (0, validateRequest_1.default)(product_validation_1.createProductValidation), product_controller_1.ProductController.createProduct);
router.get('/', auth_1.auth, (0, auth_1.authorize)('product.read'), product_controller_1.ProductController.getAllProducts);
router.get('/:id', auth_1.auth, (0, auth_1.authorize)('product.read'), product_controller_1.ProductController.getProductById);
router.put('/:id', auth_1.auth, (0, auth_1.authorize)('product.update'), (0, multer_1.uploadSingle)('image'), (0, validateRequest_1.default)(product_validation_1.updateProductValidation), product_controller_1.ProductController.updateProduct);
router.patch('/:id/delete', auth_1.auth, (0, auth_1.authorize)('product.delete'), product_controller_1.ProductController.deleteProduct);
exports.default = router;
