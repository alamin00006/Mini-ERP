"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_validation_1 = require("./category.validation");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.auth, (0, auth_1.authorize)('category.create'), (0, validateRequest_1.default)(category_validation_1.createCategoryValidation), category_controller_1.CategoryController.createCategory);
router.get('/', auth_1.auth, (0, auth_1.authorize)('category.read'), category_controller_1.CategoryController.getAllCategories);
router.get('/:id', auth_1.auth, (0, auth_1.authorize)('category.read'), category_controller_1.CategoryController.getCategoryById);
router.put('/:id', auth_1.auth, (0, auth_1.authorize)('category.update'), (0, validateRequest_1.default)(category_validation_1.updateCategoryValidation), category_controller_1.CategoryController.updateCategory);
exports.default = router;
