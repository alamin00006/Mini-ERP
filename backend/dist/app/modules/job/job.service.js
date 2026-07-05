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
exports.deleteJobService = exports.updateJobService = exports.getSingleJobService = exports.getAllJobsService = exports.createJobService = void 0;
const job_model_1 = require("./job.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createJobService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield job_model_1.Job.create(payload);
});
exports.createJobService = createJobService;
const getAllJobsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, category, isFeatured, location, page = '1', limit = '10', } = query;
    const filter = {};
    if (category) {
        filter.category = category;
    }
    if (isFeatured !== undefined) {
        filter.isFeatured = isFeatured;
    }
    if (location && mongoose_1.default.Types.ObjectId.isValid(location)) {
        filter.location = location;
    }
    // Search
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const jobs = yield job_model_1.Job.find(filter)
        .populate('location')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });
    const total = yield job_model_1.Job.countDocuments(filter);
    return { jobs, total };
});
exports.getAllJobsService = getAllJobsService;
const getSingleJobService = (id) => __awaiter(void 0, void 0, void 0, function* () { return job_model_1.Job.findById(id).populate('location'); });
exports.getSingleJobService = getSingleJobService;
const updateJobService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedJob = yield job_model_1.Job.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate('location');
    return updatedJob;
});
exports.updateJobService = updateJobService;
const deleteJobService = (id) => __awaiter(void 0, void 0, void 0, function* () { return job_model_1.Job.findByIdAndDelete(id); });
exports.deleteJobService = deleteJobService;
