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
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const config_1 = __importDefault(require("../../../config"));
const auth_service_1 = require("./auth.service");
/**
 * Handles user login authentication
 * @param req - Express request object containing user credentials
 * @param res - Express response object
 */
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield auth_service_1.AuthService.loginUser(req.body);
        // Set refresh token in HTTP-only cookie
        res.cookie('refreshToken', result.refreshToken, {
            secure: config_1.default.cookie.secure,
            httpOnly: config_1.default.cookie.httpOnly,
            sameSite: config_1.default.cookie.sameSite,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        // Send refresh token in response body as well
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'User logged in successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Refreshes access token using refresh token
 * @param req - Express request object containing refresh token
 * @param res - Express response object
 */
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get refresh token from cookie (since it's HTTP-only, client can't read it)
        const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
        if (!refreshToken) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Refresh token not found');
        }
        const result = yield auth_service_1.AuthService.refreshAccessToken(refreshToken);
        // Set new refresh token in HTTP-only cookie
        res.cookie('refreshToken', result.refreshToken, {
            secure: config_1.default.cookie.secure,
            httpOnly: config_1.default.cookie.httpOnly,
            sameSite: config_1.default.cookie.sameSite,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        // Send refresh token in response body as well
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Access token refreshed successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Logs out user by clearing refresh token
 * @param req - Express request object
 * @param res - Express response object
 */
const logoutUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Clear refresh token from database
        yield auth_service_1.AuthService.logoutUser((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        // Clear refresh token cookie
        res.clearCookie('refreshToken', {
            secure: config_1.default.cookie.secure,
            httpOnly: config_1.default.cookie.httpOnly,
            sameSite: config_1.default.cookie.sameSite,
        });
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'User logged out successfully',
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.AuthController = {
    loginUser,
    refreshToken,
    logoutUser,
};
