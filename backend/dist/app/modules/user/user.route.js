"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.auth, (0, auth_1.authorize)('user.create'), (0, validateRequest_1.default)(user_validation_1.createUserValidation), user_controller_1.UserController.createUser);
router.get('/', auth_1.auth, (0, auth_1.authorize)('user.read'), user_controller_1.UserController.getAllUsers);
router.get('/:id', auth_1.auth, (0, auth_1.authorize)('user.read'), user_controller_1.UserController.getUserById);
router.put('/:id', auth_1.auth, (0, auth_1.authorize)('user.update'), (0, validateRequest_1.default)(user_validation_1.updateUserValidation), user_controller_1.UserController.updateUser);
router.patch('/:id/toggle-status', auth_1.auth, (0, auth_1.authorize)('user.delete'), user_controller_1.UserController.toggleUserStatus);
exports.default = router;
