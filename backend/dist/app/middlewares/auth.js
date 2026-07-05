"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const config_1 = __importDefault(require("../../config"));
const auth = (...requiredRoles) => (req, res, next) => {
    try {
        // 1. Get token
        const authHeader = req.headers.authorization;
        // console.log(authHeader)
        if (!authHeader) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized');
        }
        // If token comes as "Bearer token"
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : authHeader;
        // 2. Verify token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
        // 3. Attach user to request
        req.user = decoded;
        // 4. Check roles (if any required)
        if (requiredRoles.length > 0) {
            if (!decoded.role || !requiredRoles.includes(decoded.role)) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
            }
        }
        next();
    }
    catch (err) {
        next(err instanceof ApiError_1.default
            ? err
            : new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid or expired token'));
    }
};
exports.default = auth;
