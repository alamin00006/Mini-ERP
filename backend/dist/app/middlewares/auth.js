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
exports.authorize = exports.auth = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const config_1 = __importDefault(require("../../config"));
const user_model_1 = __importDefault(require("../../app/modules/user/user.model"));
const userRole_model_1 = __importDefault(require("../../app/modules/userRole/userRole.model"));
const rolePermission_model_1 = __importDefault(require("../../app/modules/rolePermission/rolePermission.model"));
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized');
        }
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : authHeader;
        if (!config_1.default.jwt.secret) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'JWT secret is not configured');
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
        const user = yield user_model_1.default.findById(decoded.userId);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'User not found');
        }
        const userRole = yield userRole_model_1.default.findOne({ user: user._id }).populate('role');
        if (!userRole) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'User role not found');
        }
        const role = userRole.role;
        const rolePermissions = yield rolePermission_model_1.default.find({
            role: role._id,
        }).populate('permission');
        const permissions = rolePermissions
            .filter((rp) => rp.permission && rp.allowed)
            .map((rp) => rp.permission.key);
        req.user = {
            userId: user._id.toString(),
            roleId: role._id.toString(),
            roleName: role.name,
            permissions,
        };
        next();
    }
    catch (err) {
        if (err instanceof ApiError_1.default) {
            next(err);
        }
        else {
            next(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid or expired token'));
        }
    }
});
exports.auth = auth;
const authorize = (...requiredPermissions) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized');
            }
            if (user.roleName === 'Admin') {
                return next();
            }
            const hasPermission = requiredPermissions.some(permission => user.permissions.includes(permission));
            if (!hasPermission) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You do not have permission to access this resource');
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.authorize = authorize;
