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
exports.RoleService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const role_model_1 = __importDefault(require("./role.model"));
const permission_model_1 = __importDefault(require("../permission/permission.model"));
const rolePermission_model_1 = __importDefault(require("../rolePermission/rolePermission.model"));
/**
 * Creates a new role with optional permissions
 * @param payload - Role creation data (name, description, permissions)
 * @returns Promise<TRoleResponse> - Created role data with permissions
 */
const createRole = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, permissions = [] } = payload;
    const existingRole = yield role_model_1.default.findOne({ name });
    if (existingRole) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Role with this name already exists');
    }
    const role = yield role_model_1.default.create({
        name,
        description,
        isSystem: false,
    });
    if (permissions.length > 0) {
        const permissionDocs = yield permission_model_1.default.find({ key: { $in: permissions } });
        const rolePermissions = permissionDocs.map(permission => ({
            role: role._id,
            permission: permission._id,
            allowed: true,
        }));
        yield rolePermission_model_1.default.insertMany(rolePermissions);
    }
    const populatedRole = yield role_model_1.default.findById(role._id).populate({
        path: 'rolePermissions',
        populate: {
            path: 'permission',
        },
    });
    const rolePermissions = populatedRole.rolePermissions || [];
    const permissionKeys = rolePermissions
        .filter((rp) => rp.permission && rp.allowed)
        .map((rp) => rp.permission.key);
    return {
        _id: role._id.toString(),
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
        permissions: permissionKeys,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
    };
});
/**
 * Retrieves all roles with their permissions
 * @returns Promise<TRoleResponse[]> - Array of all roles
 */
const getAllRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield role_model_1.default.find().populate({
        path: 'rolePermissions',
        populate: {
            path: 'permission',
        },
    });
    return roles.map(role => {
        const rolePermissions = role.rolePermissions || [];
        const permissionKeys = rolePermissions
            .filter((rp) => rp.permission && rp.allowed)
            .map((rp) => rp.permission.key);
        return {
            _id: role._id.toString(),
            name: role.name,
            description: role.description,
            isSystem: role.isSystem,
            permissions: permissionKeys,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        };
    });
});
/**
 * Retrieves a role by ID with populated permissions
 * @param id - Role ID
 * @returns Promise<TRoleResponse> - Role data with permissions
 */
const getRoleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const role = yield role_model_1.default.findById(id).populate({
        path: 'rolePermissions',
        populate: {
            path: 'permission',
        },
    });
    if (!role) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Role not found');
    }
    const rolePermissions = role.rolePermissions || [];
    const permissionKeys = rolePermissions
        .filter((rp) => rp.permission && rp.allowed)
        .map((rp) => rp.permission.key);
    return {
        _id: role._id.toString(),
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
        permissions: permissionKeys,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
    };
});
/**
 * Updates a role by ID
 * @param id - Role ID to update
 * @param payload - Partial role data to update (name, description, permissions)
 * @returns Promise<TRoleResponse> - Updated role data
 */
const updateRole = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const role = yield role_model_1.default.findById(id);
    if (!role) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Role not found');
    }
    if (payload.name && payload.name !== role.name) {
        const existingRole = yield role_model_1.default.findOne({ name: payload.name });
        if (existingRole) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Role with this name already exists');
        }
    }
    const updatedRole = yield role_model_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (payload.permissions) {
        yield rolePermission_model_1.default.deleteMany({ role: id });
        const permissionDocs = yield permission_model_1.default.find({
            key: { $in: payload.permissions },
        });
        const rolePermissions = permissionDocs.map(permission => ({
            role: id,
            permission: permission._id,
            allowed: true,
        }));
        yield rolePermission_model_1.default.insertMany(rolePermissions);
    }
    const populatedRole = yield role_model_1.default.findById(id).populate({
        path: 'rolePermissions',
        populate: {
            path: 'permission',
        },
    });
    const rolePermissions = populatedRole.rolePermissions || [];
    const permissionKeys = rolePermissions
        .filter((rp) => rp.permission && rp.allowed)
        .map((rp) => rp.permission.key);
    return {
        _id: updatedRole._id.toString(),
        name: updatedRole.name,
        description: updatedRole.description,
        isSystem: updatedRole.isSystem,
        permissions: permissionKeys,
        createdAt: updatedRole.createdAt,
        updatedAt: updatedRole.updatedAt,
    };
});
/**
 * Deactivates a role by ID (soft delete)
 * @param id - Role ID to deactivate
 * @returns Promise<TRoleResponse> - Deactivated role data
 */
const deactivateRole = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const role = yield role_model_1.default.findById(id);
    if (!role) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Role not found');
    }
    if (role.isSystem) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Cannot deactivate system role');
    }
    const deactivatedRole = yield role_model_1.default.findByIdAndUpdate(id, { isActive: false }, { new: true });
    const populatedRole = yield role_model_1.default.findById(id).populate({
        path: 'rolePermissions',
        populate: {
            path: 'permission',
        },
    });
    const rolePermissions = populatedRole.rolePermissions || [];
    const permissionKeys = rolePermissions
        .filter((rp) => rp.permission && rp.allowed)
        .map((rp) => rp.permission.key);
    return {
        _id: deactivatedRole._id.toString(),
        name: deactivatedRole.name,
        description: deactivatedRole.description,
        isSystem: deactivatedRole.isSystem,
        permissions: permissionKeys,
        createdAt: deactivatedRole.createdAt,
        updatedAt: deactivatedRole.updatedAt,
    };
});
exports.RoleService = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deactivateRole,
};
