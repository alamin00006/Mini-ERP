"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const mongoose_1 = require("mongoose");
const jobSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    location: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        //   enum: [
        //     'Design',
        //     'Sales',
        //     'Marketing',
        //     'Finance',
        //     'Technology',
        //     'Engineering',
        //     'Business',
        //     'Human Resource',
        //   ],
    },
    type: {
        type: String,
        enum: ['Full Time', 'Part Time', 'Contract', 'Internship'],
        default: 'Full Time',
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
        maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    tags: {
        type: [String],
        default: [],
    },
}, { timestamps: true });
//  Better search index
jobSchema.index({ title: 'text', company: 'text', description: 'text' }, {
    weights: {
        title: 5,
        company: 3,
        description: 1,
    },
});
jobSchema.index({ category: 1 });
jobSchema.index({ location: 1 });
//  Virtual relation with Applications
jobSchema.virtual('applications', {
    ref: 'Application',
    localField: '_id',
    foreignField: 'job_id',
});
jobSchema.set('toObject', { virtuals: true });
jobSchema.set('toJSON', { virtuals: true });
exports.Job = (0, mongoose_1.model)('Job', jobSchema);
