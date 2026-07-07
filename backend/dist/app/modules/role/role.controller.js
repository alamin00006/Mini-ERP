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
exports.RoleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const role_service_1 = require("./role.service");
/**
 * Creates a new role
 * @param req - Express request object containing role data
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const createRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield role_service_1.RoleService.createRole(req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: 'Role created successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Retrieves all roles
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const getAllRoles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield role_service_1.RoleService.getAllRoles();
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Roles retrieved successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Retrieves a role by ID
 * @param req - Express request object with role ID in params
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const getRoleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield role_service_1.RoleService.getRoleById(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Role retrieved successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Updates a role by ID
 * @param req - Express request object with role ID in params and update data in body
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const updateRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield role_service_1.RoleService.updateRole(id, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Role updated successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Deactivates a role by ID
 * @param req - Express request object with role ID in params
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const deactivateRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield role_service_1.RoleService.deactivateRole(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Role deactivated successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Deletes a role by ID (hard delete)
 * @param req - Express request object with role ID in params
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const deleteRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield role_service_1.RoleService.deleteRole(id);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: result.message,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.RoleController = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deactivateRole,
    deleteRole,
};
