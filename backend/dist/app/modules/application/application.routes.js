"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const application_validation_1 = require("./application.validation");
const application_controller_1 = require("./application.controller");
const router = express_1.default.Router();
// Submit application (Public)
router.post('/', (0, validateRequest_1.default)(application_validation_1.ApplicationValidation.applyZodSchema), application_controller_1.ApplicationController.applyJob);
// Admin view applications
router.get('/job/:jobId', application_controller_1.ApplicationController.getApplicationsByJob);
router.get('/', application_controller_1.ApplicationController.getAllApplications);
exports.ApplicationRoutes = router;
