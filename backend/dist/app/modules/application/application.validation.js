"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationValidation = void 0;
const zod_1 = require("zod");
const applyZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        job_id: zod_1.z.string().min(1, 'Job ID is required'),
        name: zod_1.z
            .string()
            .min(1, 'Name is required')
            .max(100, 'Name cannot exceed 100 characters'),
        email: zod_1.z.string().email('Please provide a valid email address'),
        resume_link: zod_1.z
            .string()
            .url('Resume link must be a valid URL')
            .refine(url => url.startsWith('http://') || url.startsWith('https://'), 'Resume link must start with http:// or https://'),
        cover_note: zod_1.z
            .string()
            .min(1, 'Cover note is required')
            .max(2000, 'Cover note cannot exceed 2000 characters'),
    }),
});
exports.ApplicationValidation = {
    applyZodSchema,
};
