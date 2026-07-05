"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const mongoose_1 = require("mongoose");
const applicationSchema = new mongoose_1.Schema({
    job_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, 'Job ID is required'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address',
        ],
    },
    resume_link: {
        type: String,
        required: [true, 'Resume link is required'],
        trim: true,
        validate: {
            validator: (v) => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(v),
            message: 'Please provide a valid URL',
        },
    },
    cover_note: {
        type: String,
        required: [true, 'Cover note is required'],
        trim: true,
        maxlength: [2000, 'Cover note cannot exceed 2000 characters'],
    },
}, {
    timestamps: true,
});
// Prevent duplicate apply per job
applicationSchema.index({ job_id: 1, email: 1 }, { unique: true });
exports.Application = (0, mongoose_1.model)('Application', applicationSchema);
