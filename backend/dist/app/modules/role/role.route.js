"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = require("./role.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const role_validation_1 = require("./role.validation");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.auth, (0, auth_1.authorize)('role.create'), (0, validateRequest_1.default)(role_validation_1.createRoleValidation), role_controller_1.RoleController.createRole);
router.get('/', auth_1.auth, (0, auth_1.authorize)('role.read'), role_controller_1.RoleController.getAllRoles);
router.get('/:id', auth_1.auth, (0, auth_1.authorize)('role.read'), role_controller_1.RoleController.getRoleById);
router.put('/:id', auth_1.auth, (0, auth_1.authorize)('role.update'), (0, validateRequest_1.default)(role_validation_1.updateRoleValidation), role_controller_1.RoleController.updateRole);
router.patch('/:id/deactivate', auth_1.auth, (0, auth_1.authorize)('role.delete'), role_controller_1.RoleController.deactivateRole);
router.delete('/:id', auth_1.auth, (0, auth_1.authorize)('role.delete'), role_controller_1.RoleController.deleteRole);
exports.default = router;
