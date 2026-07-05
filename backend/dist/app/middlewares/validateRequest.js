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
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const validateRequest = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request
        yield schema.parseAsync({
            body: req.body,
        });
        next();
    }
    catch (err) {
        if (err === null || err === void 0 ? void 0 : err.issues) {
            // Transform Zod validation errors into ApiError
            const messages = err.issues
                .map((issue) => `${issue.path.join('.')} - ${issue.message}`)
                .join(', ');
            return next(new ApiError_1.default(400, `Validation failed: ${messages}`));
        }
        // Fallback for unexpected errors
        return next(new ApiError_1.default(500, err.message));
    }
});
exports.default = validateRequest;
