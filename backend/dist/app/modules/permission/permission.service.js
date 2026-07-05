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
exports.PermissionService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const permission_model_1 = __importDefault(require("./permission.model"));
const rolePermission_model_1 = __importDefault(require("../rolePermission/rolePermission.model"));
const createPermission = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, name, description, group, module } = payload;
    const existingPermission = yield permission_model_1.default.findOne({ key });
    if (existingPermission) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Permission with this key already exists');
    }
    const permission = yield permission_model_1.default.create({
        key,
        name,
        description,
        group,
        module,
        isSystem: false,
    });
    return {
        _id: permission._id.toString(),
        key: permission.key,
        name: permission.name,
        description: permission.description,
        group: permission.group,
        module: permission.module,
        isSystem: permission.isSystem,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
    };
});
const getAllPermissions = () => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = yield permission_model_1.default.find().sort({
        module: 1,
        group: 1,
        key: 1,
    });
    return permissions.map(permission => ({
        _id: permission._id.toString(),
        key: permission.key,
        name: permission.name,
        description: permission.description,
        group: permission.group,
        module: permission.module,
        isSystem: permission.isSystem,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
    }));
});
const getPermissionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const permission = yield permission_model_1.default.findById(id);
    if (!permission) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Permission not found');
    }
    return {
        _id: permission._id.toString(),
        key: permission.key,
        name: permission.name,
        description: permission.description,
        group: permission.group,
        module: permission.module,
        isSystem: permission.isSystem,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
    };
});
const updatePermission = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const permission = yield permission_model_1.default.findById(id);
    if (!permission) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Permission not found');
    }
    if (payload.key && payload.key !== permission.key) {
        const existingPermission = yield permission_model_1.default.findOne({ key: payload.key });
        if (existingPermission) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Permission with this key already exists');
        }
    }
    const updatedPermission = yield permission_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return {
        _id: updatedPermission._id.toString(),
        key: updatedPermission.key,
        name: updatedPermission.name,
        description: updatedPermission.description,
        group: updatedPermission.group,
        module: updatedPermission.module,
        isSystem: updatedPermission.isSystem,
        createdAt: updatedPermission.createdAt,
        updatedAt: updatedPermission.updatedAt,
    };
});
const deletePermission = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const permission = yield permission_model_1.default.findById(id);
    if (!permission) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Permission not found');
    }
    const rolePermissionCount = yield rolePermission_model_1.default.countDocuments({
        permission: id,
    });
    if (rolePermissionCount > 0) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Cannot delete permission. It is assigned to one or more roles');
    }
    yield permission_model_1.default.findByIdAndDelete(id);
});
exports.PermissionService = {
    createPermission,
    getAllPermissions,
    getPermissionById,
    updatePermission,
    deletePermission,
};
