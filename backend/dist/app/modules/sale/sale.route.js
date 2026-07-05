"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sale_controller_1 = require("./sale.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const sale_validation_1 = require("./sale.validation");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.auth, (0, auth_1.authorize)('sale.create'), (0, validateRequest_1.default)(sale_validation_1.createSaleValidation), sale_controller_1.SaleController.createSale);
exports.default = router;
