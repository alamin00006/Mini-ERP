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
exports.SaleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const sale_service_1 = require("./sale.service");
const sale_model_1 = __importDefault(require("./sale.model"));
/**
 * Creates a new sale transaction
 * @param req - Express request object containing sale data and user info from auth middleware
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const createSale = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const io = req.app.get('socketio');
        const result = yield sale_service_1.SaleService.createSale(Object.assign(Object.assign({}, req.body), { createdBy: userId, io }));
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: 'Sale created successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Retrieves all sales with pagination
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function for error handling
 */
const getSales = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [sales, total] = yield Promise.all([
            sale_model_1.default.find()
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            sale_model_1.default.countDocuments(),
        ]);
        const totalPages = Math.ceil(total / limit);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Sales retrieved successfully',
            data: sales,
            meta: {
                page,
                limit,
                total,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.SaleController = {
    createSale,
    getSales,
};
