"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.loginValidation), auth_controller_1.AuthController.loginUser);
router.post('/refresh-token', auth_controller_1.AuthController.refreshToken);
router.post('/logout', auth_1.auth, auth_controller_1.AuthController.logoutUser);
exports.default = router;
