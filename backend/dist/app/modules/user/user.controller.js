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
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const user_service_1 = require("./user.service");
/**
 * Creates a new user
 * @param req - Express request object containing user data
 * @param res - Express response object
  
 */
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserService.createUser(req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: 'User created successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Retrieves all users
 * @param req - Express request object
 * @param res - Express response object
  
 */
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserService.getAllUsers();
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Users retrieved successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Retrieves a user by ID
 * @param req - Express request object with user ID in params
 * @param res - Express response object
  
 */
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield user_service_1.UserService.getUserById(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'User retrieved successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Updates a user by ID
 * @param req - Express request object with user ID in params and update data in body
 * @param res - Express response object
  
 */
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield user_service_1.UserService.updateUser(id, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'User updated successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Toggles user active/inactive status
 * @param req - Express request object with user ID in params
 * @param res - Express response object
 */
const toggleUserStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield user_service_1.UserService.toggleUserStatus(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: result.isActive
                ? 'User activated successfully'
                : 'User deactivated successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.UserController = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    toggleUserStatus,
};
