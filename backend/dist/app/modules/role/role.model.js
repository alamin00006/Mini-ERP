"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roleSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    isSystem: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Virtual populate for rolePermissions
roleSchema.virtual('rolePermissions', {
    ref: 'RolePermission',
    localField: '_id',
    foreignField: 'role',
});
// NOTE: `strictPopulate` option type may not be available in the current Mongoose typings.
// Virtuals can still be populated via `populate()`.
const Role = (0, mongoose_1.model)('Role', roleSchema);
exports.default = Role;
