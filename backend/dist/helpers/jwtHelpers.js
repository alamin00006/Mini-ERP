"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const config_1 = __importDefault(require("../config"));
const generateToken = (payload) => {
    try {
        if (!config_1.default.jwt.secret || !config_1.default.jwt.expires_in) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'JWT configuration is missing');
        }
        const secret = config_1.default.jwt.secret;
        const options = {
            expiresIn: config_1.default.jwt.expires_in,
        };
        return jsonwebtoken_1.default.sign(payload, secret, options);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to generate token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
const verifyToken = (token) => {
    try {
        if (!config_1.default.jwt.secret) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'JWT secret missing');
        }
        return jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
    }
    catch (_a) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid or expired token');
    }
};
exports.jwtHelpers = {
    generateToken,
    verifyToken,
};
