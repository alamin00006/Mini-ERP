"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobValidation = void 0;
const zod_1 = require("zod");
const createJobZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string()
            .min(1, 'Job title is required')
            .max(200, 'Title cannot exceed 200 characters'),
        company: zod_1.z
            .string()
            .min(1, 'Company name is required')
            .max(100, 'Company name cannot exceed 100 characters'),
        location: zod_1.z
            .string()
            .min(1, 'Location is required')
            .max(100, 'Location cannot exceed 100 characters'),
        // category: z.enum([
        //   'Design',
        //   'Sales',
        //   'Marketing',
        //   'Finance',
        //   'Technology',
        //   'Engineering',
        //   'Business',
        //   'Human Resource',
        // ]),
        type: zod_1.z
            .enum(['Full Time', 'Part Time', 'Contract', 'Internship'])
            .optional(),
        description: zod_1.z
            .string()
            .min(1, 'Job description is required')
            .max(5000, 'Description cannot exceed 5000 characters'),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.JobValidation = {
    createJobZodSchema,
};
