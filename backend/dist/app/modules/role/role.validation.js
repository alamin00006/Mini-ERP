"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleValidation = exports.createRoleValidation = void 0;
const zod_1 = require("zod");
exports.createRoleValidation = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    description: zod_1.z.string().optional(),
    permissions: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateRoleValidation = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
    description: zod_1.z.string().optional(),
    permissions: zod_1.z.array(zod_1.z.string()).optional(),
});
