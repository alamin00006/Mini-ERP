"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRegistrationValidation = void 0;
const zod_1 = require("zod");
const createClientRegistrationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name must not exceed 100 characters'),
        email: zod_1.z.string().optional(),
        mobile: zod_1.z.string().min(8, 'Mobile number must be at least 8 digits'),
        whatsapp: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'inactive']).optional(),
    }),
});
exports.ClientRegistrationValidation = {
    createClientRegistrationZodSchema,
};
