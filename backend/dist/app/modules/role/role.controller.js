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
exports.RoleController = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deactivateRole,
};
