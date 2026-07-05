"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const job_validation_1 = require("./job.validation");
const job_controller_1 = require("./job.controller");
const router = express_1.default.Router();
// Public routes
router.get('/', job_controller_1.JobController.getAllJobs);
router.get('/:id', job_controller_1.JobController.getSingleJob);
// Admin-only routes
router.post('/', (0, validateRequest_1.default)(job_validation_1.JobValidation.createJobZodSchema), job_controller_1.JobController.createJob);
router.patch('/:id', job_controller_1.JobController.updateJob);
router.delete('/:id', job_controller_1.JobController.deleteJob);
exports.JobRoutes = router;
