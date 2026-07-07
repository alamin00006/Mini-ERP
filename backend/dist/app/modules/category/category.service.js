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
exports.CategoryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const category_model_1 = __importDefault(require("./category.model"));
/**
 * Creates a new category
 * @param payload - Category creation data (name, description, isActive)
 * @returns Promise<TCategoryResponse> - Created category data
 */
const createCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, isActive } = payload;
    const existingCategory = yield category_model_1.default.findOne({ name });
    if (existingCategory) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Category with this name already exists');
    }
    const category = yield category_model_1.default.create({
        name,
        description,
        isActive: isActive !== null && isActive !== void 0 ? isActive : true,
    });
    return {
        _id: category._id.toString(),
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
    };
});
/**
 * Retrieves all categories
 * @returns Promise<TCategoryResponse[]> - List of all categories
 */
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_model_1.default.find().sort({ createdAt: -1 });
    return categories.map(category => ({
        _id: category._id.toString(),
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
    }));
});
/**
 * Retrieves a category by ID
 * @param id - Category ID
 * @returns Promise<TCategoryResponse> - Category data
 */
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.findById(id);
    if (!category) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category not found');
    }
    return {
        _id: category._id.toString(),
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
    };
});
/**
 * Updates a category by ID
 * @param id - Category ID to update
 * @param payload - Partial category data to update
 * @returns Promise<TCategoryResponse> - Updated category data
 */
const updateCategory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.findById(id);
    if (!category) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Category not found');
    }
    if (payload.name && payload.name !== category.name) {
        const existingCategory = yield category_model_1.default.findOne({ name: payload.name });
        if (existingCategory) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Category with this name already exists');
        }
    }
    const updatedCategory = yield category_model_1.default.findByIdAndUpdate(id, Object.assign({}, payload), { new: true });
    return {
        _id: updatedCategory._id.toString(),
        name: updatedCategory.name,
        description: updatedCategory.description,
        isActive: updatedCategory.isActive,
        createdAt: updatedCategory.createdAt,
        updatedAt: updatedCategory.updatedAt,
    };
});
exports.CategoryService = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
};
