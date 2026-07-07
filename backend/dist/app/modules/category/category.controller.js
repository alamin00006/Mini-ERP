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
exports.CategoryController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const category_service_1 = require("./category.service");
/**
 * Creates a new category
 * @param req - Express request object containing category data
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield category_service_1.CategoryService.createCategory(req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: 'Category created successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Retrieves all categories
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const getAllCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield category_service_1.CategoryService.getAllCategories();
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Categories retrieved successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Retrieves a category by ID
 * @param req - Express request object with category ID in params
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const getCategoryById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield category_service_1.CategoryService.getCategoryById(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Category retrieved successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Updates a category by ID
 * @param req - Express request object with category ID in params and update data in body
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield category_service_1.CategoryService.updateCategory(id, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Category updated successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.CategoryController = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
};
