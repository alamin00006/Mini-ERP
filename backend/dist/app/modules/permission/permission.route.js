"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permission_controller_1 = require("./permission.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const permission_validation_1 = require("./permission.validation");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.auth, (0, auth_1.authorize)('permission.create'), (0, validateRequest_1.default)(permission_validation_1.createPermissionValidation), permission_controller_1.PermissionController.createPermission);
router.get('/', auth_1.auth, (0, auth_1.authorize)('permission.read'), permission_controller_1.PermissionController.getAllPermissions);
router.get('/:id', auth_1.auth, (0, auth_1.authorize)('permission.read'), permission_controller_1.PermissionController.getPermissionById);
router.put('/:id', auth_1.auth, (0, auth_1.authorize)('permission.update'), (0, validateRequest_1.default)(permission_validation_1.updatePermissionValidation), permission_controller_1.PermissionController.updatePermission);
router.delete('/:id', auth_1.auth, (0, auth_1.authorize)('permission.delete'), permission_controller_1.PermissionController.deletePermission);
exports.default = router;
