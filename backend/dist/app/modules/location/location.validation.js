"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationValidation = void 0;
const zod_1 = require("zod");
const createLocationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        city: zod_1.z.string().min(1, 'City is required').trim(),
        country: zod_1.z.string().min(1, 'Country is required').trim(),
    }),
});
exports.LocationValidation = {
    createLocationZodSchema,
};
