"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.auth, (0, auth_1.authorize)('dashboard.read'), dashboard_controller_1.DashboardController.getDashboardStats);
exports.default = router;
