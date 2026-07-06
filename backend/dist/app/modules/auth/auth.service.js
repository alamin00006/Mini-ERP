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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const passwordHelpers_1 = require("../../../helpers/passwordHelpers");
const user_model_1 = __importDefault(require("../user/user.model"));
const userRole_model_1 = __importDefault(require("../userRole/userRole.model"));
const rolePermission_model_1 = __importDefault(require("../rolePermission/rolePermission.model"));
/**
 * Authenticates user and generates access token
 * @param payload - User login credentials (email and password)
 * @returns Promise<TLoginResponse> - Access token and user information with permissions
 */
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const user = yield user_model_1.default.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const isPasswordMatched = yield (0, passwordHelpers_1.comparePassword)(password, user.password);
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Password is incorrect');
    }
    const userRole = yield userRole_model_1.default.findOne({ user: user._id }).populate('role');
    if (!userRole) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User role not found');
    }
    const role = userRole.role;
    const rolePermissions = yield rolePermission_model_1.default.find({
        role: role._id,
    }).populate('permission');
    const permissions = rolePermissions
        .filter((rp) => rp.permission && rp.allowed)
        .map((rp) => rp.permission.key);
    const tokenPayload = {
        userId: user._id.toString(),
        roleId: role._id.toString(),
        roleName: role.name,
        permissions,
    };
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken(tokenPayload);
    return {
        accessToken,
        user: {
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: role.name,
            permissions,
        },
    };
});
exports.AuthService = {
    loginUser,
};
