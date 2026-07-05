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
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const passwordHelpers_1 = require("../../../helpers/passwordHelpers");
const user_model_1 = __importDefault(require("./user.model"));
const userRole_model_1 = __importDefault(require("../userRole/userRole.model"));
const role_model_1 = __importDefault(require("../role/role.model"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = payload;
    const existingUser = yield user_model_1.default.findOne({ email });
    if (existingUser) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'User with this email already exists');
    }
    const hashedPassword = yield (0, passwordHelpers_1.hashPassword)(password);
    const user = yield user_model_1.default.create({
        name,
        email,
        password: hashedPassword,
    });
    const roleDoc = yield role_model_1.default.findOne({ name: role });
    if (!roleDoc) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Role not found');
    }
    yield userRole_model_1.default.create({
        user: user._id,
        role: roleDoc._id,
    });
    const populatedUser = yield user_model_1.default.findById(user._id).populate({
        path: 'userRoles',
        populate: {
            path: 'role',
        },
    });
    return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: roleDoc.name,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find().populate({
        path: 'userRoles',
        populate: {
            path: 'role',
        },
    });
    return users.map(user => {
        var _a, _b;
        const userRole = (_a = user.userRoles) === null || _a === void 0 ? void 0 : _a[0];
        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: ((_b = userRole === null || userRole === void 0 ? void 0 : userRole.role) === null || _b === void 0 ? void 0 : _b.name) || 'No Role',
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    });
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield user_model_1.default.findById(id).populate({
        path: 'userRoles',
        populate: {
            path: 'role',
        },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const userRole = (_a = user.userRoles) === null || _a === void 0 ? void 0 : _a[0];
    return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: ((_b = userRole === null || userRole === void 0 ? void 0 : userRole.role) === null || _b === void 0 ? void 0 : _b.name) || 'No Role',
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.default.findById(id);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (payload.email && payload.email !== user.email) {
        const existingUser = yield user_model_1.default.findOne({ email: payload.email });
        if (existingUser) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'User with this email already exists');
        }
    }
    if (payload.password) {
        payload.password = yield (0, passwordHelpers_1.hashPassword)(payload.password);
    }
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (payload.role) {
        const roleDoc = yield role_model_1.default.findOne({ name: payload.role });
        if (roleDoc) {
            yield userRole_model_1.default.findOneAndUpdate({ user: id }, { role: roleDoc._id }, { new: true, upsert: true });
        }
    }
    const userRole = yield userRole_model_1.default.findOne({ user: id }).populate('role');
    return {
        _id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: ((_a = userRole === null || userRole === void 0 ? void 0 : userRole.role) === null || _a === void 0 ? void 0 : _a.name) || 'No Role',
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
    };
});
const deactivateUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.default.findById(id);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const deactivatedUser = yield user_model_1.default.findByIdAndUpdate(id, { isActive: false }, { new: true });
    const userRole = yield userRole_model_1.default.findOne({ user: id }).populate('role');
    return {
        _id: deactivatedUser._id.toString(),
        name: deactivatedUser.name,
        email: deactivatedUser.email,
        role: ((_a = userRole === null || userRole === void 0 ? void 0 : userRole.role) === null || _a === void 0 ? void 0 : _a.name) || 'No Role',
        isActive: deactivatedUser.isActive,
        createdAt: deactivatedUser.createdAt,
        updatedAt: deactivatedUser.updatedAt,
    };
});
exports.UserService = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deactivateUser,
};
