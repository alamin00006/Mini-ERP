"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePermissionValidation = exports.createPermissionValidation = void 0;
const zod_1 = require("zod");
exports.createPermissionValidation = zod_1.z.object({
    key: zod_1.z.string().min(2, 'Key must be at least 2 characters'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    description: zod_1.z.string().optional(),
    group: zod_1.z.string().optional(),
    module: zod_1.z.string().optional(),
});
exports.updatePermissionValidation = zod_1.z.object({
    key: zod_1.z.string().min(2, 'Key must be at least 2 characters').optional(),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
    description: zod_1.z.string().optional(),
    group: zod_1.z.string().optional(),
    module: zod_1.z.string().optional(),
});
