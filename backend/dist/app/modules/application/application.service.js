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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllApplicationsService = exports.getApplicationsByJobService = exports.applyJobService = void 0;
const application_model_1 = require("./application.model");
const applyJobService = (payload) => __awaiter(void 0, void 0, void 0, function* () { return application_model_1.Application.create(payload); });
exports.applyJobService = applyJobService;
const getApplicationsByJobService = (jobId) => __awaiter(void 0, void 0, void 0, function* () { return application_model_1.Application.find({ job_id: jobId }).sort({ createdAt: -1 }); });
exports.getApplicationsByJobService = getApplicationsByJobService;
/**
 * Get all applications
 */
const getAllApplicationsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const applications = yield application_model_1.Application.find().sort({ createdAt: -1 });
    return applications;
});
exports.getAllApplicationsService = getAllApplicationsService;
