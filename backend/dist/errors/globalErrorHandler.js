"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("./ApiError"));
const handleValidationError_1 = __importDefault(require("./handleValidationError"));
const handleCastError_1 = __importDefault(require("./handleCastError"));
const handleDuplicateError_1 = __importDefault(require("./handleDuplicateError"));
const config_1 = __importDefault(require("../config"));
const globalErrorHandler = (err, req, res, next) => {
    // Default values
    let statusCode = 500;
    let message = 'Something went wrong';
    let errorSources = [
        {
            path: '',
            message: 'Something went wrong',
        },
    ];
    // Determine error type for switch
    const errorType = (() => {
        if ((err === null || err === void 0 ? void 0 : err.name) === 'ValidationError')
            return 'ValidationError';
        if ((err === null || err === void 0 ? void 0 : err.name) === 'CastError')
            return 'CastError';
        if ((err === null || err === void 0 ? void 0 : err.code) === 11000)
            return 'DuplicateError';
        if (err instanceof ApiError_1.default)
            return 'ApiError';
        if (err instanceof Error)
            return 'GenericError';
        return 'UnknownError';
    })();
    // Handle errors using switch
    switch (errorType) {
        case 'ValidationError':
            const validationError = (0, handleValidationError_1.default)(err);
            statusCode = validationError.statusCode;
            message = validationError.message;
            errorSources = validationError.errorSources;
            break;
        case 'CastError':
            const castError = (0, handleCastError_1.default)(err);
            statusCode = castError.statusCode;
            message = castError.message;
            errorSources = castError.errorSources;
            break;
        case 'DuplicateError':
            const duplicateError = (0, handleDuplicateError_1.default)(err);
            statusCode = duplicateError.statusCode;
            message = duplicateError.message;
            errorSources = duplicateError.errorSources;
            break;
        case 'ApiError':
            statusCode = err.statusCode;
            message = err.message;
            errorSources = [
                {
                    path: '',
                    message: err.message,
                },
            ];
            break;
        case 'GenericError':
            message = err.message;
            errorSources = [
                {
                    path: '',
                    message: err.message,
                },
            ];
            break;
        default:
            // UnknownError: Use default values
            break;
    }
    // Send response
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config_1.default.env === 'development' ? err === null || err === void 0 ? void 0 : err.stack : null,
    });
    return; // Explicitly return void
};
exports.default = globalErrorHandler;
