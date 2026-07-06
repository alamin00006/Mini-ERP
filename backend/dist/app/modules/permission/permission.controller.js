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
exports.PermissionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const permission_service_1 = require("./permission.service");
/**
 * Creates a new permission
 * @param req - Express request object containing permission data
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const createPermission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield permission_service_1.PermissionService.createPermission(req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: 'Permission created successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Retrieves all permissions
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const getAllPermissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield permission_service_1.PermissionService.getAllPermissions();
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Permissions retrieved successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Retrieves a permission by ID
 * @param req - Express request object with permission ID in params
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const getPermissionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield permission_service_1.PermissionService.getPermissionById(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Permission retrieved successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Updates a permission by ID
 * @param req - Express request object with permission ID in params and update data in body
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const updatePermission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield permission_service_1.PermissionService.updatePermission(id, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Permission updated successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Deletes a permission by ID
 * @param req - Express request object with permission ID in params
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const deletePermission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield permission_service_1.PermissionService.deletePermission(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Permission deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.PermissionController = {
    createPermission,
    getAllPermissions,
    getPermissionById,
    updatePermission,
    deletePermission,
};
