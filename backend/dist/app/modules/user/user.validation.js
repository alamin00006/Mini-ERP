"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidation = exports.createUserValidation = void 0;
const zod_1 = require("zod");
exports.createUserValidation = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.string().min(1, 'Role is required'),
});
exports.updateUserValidation = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: zod_1.z.string().email('Invalid email address').optional(),
    password: zod_1.z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .optional(),
    role: zod_1.z.string().min(1, 'Role is required').optional(),
    isActive: zod_1.z.boolean().optional(),
});
