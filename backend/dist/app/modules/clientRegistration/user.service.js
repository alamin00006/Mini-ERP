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
exports.userService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const user_model_1 = require("./user.model");
/* ===============================
   🧑‍💻 REGISTER USER
================================ */
const createUserRegistration = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 🔎 Check existing user by email
    const isExist = yield user_model_1.UserRegistration.findOne({
        email: payload.email,
    });
    if (isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User already registered with this email.');
    }
    // ✅ Create user (password auto hashed in pre-save)
    const user = yield user_model_1.UserRegistration.create(payload);
    // 🔐 Generate JWT
    const token = jwtHelpers_1.jwtHelpers.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });
    return { token, user };
});
/* ===============================
   🔑 LOGIN USER
================================ */
const createLogin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(password);
    if (!email || !password) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Please provide email and password.');
    }
    //  Must select password manually
    const user = yield user_model_1.UserRegistration.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No user found with this email.');
    }
    //  Check status
    if (user.status !== 'active') {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Your account is inactive. Please contact support.');
    }
    //  Compare password
    const isMatched = yield user_model_1.UserRegistration.isPasswordMatched(password, user.password);
    if (!isMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid credentials.');
    }
    console.log(user);
    //  Generate token
    const token = jwtHelpers_1.jwtHelpers.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });
    // Remove password before return
    user.password = undefined;
    return { token, user };
});
/* ===============================
    GET USER BY EMAIL
================================ */
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email is required.');
    }
    const user = yield user_model_1.UserRegistration.findOne({ email });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No account found with this email.');
    }
    return user;
});
/* ===============================
    GET ALL USERS
================================ */
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.UserRegistration.find({});
    return users;
});
exports.userService = {
    createUserRegistration,
    createLogin,
    getUserByEmail,
    getAllUsers,
};
