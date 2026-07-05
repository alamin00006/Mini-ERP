"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userRoleSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
}, {
    timestamps: true,
});
userRoleSchema.index({ user: 1, role: 1 }, { unique: true });
userRoleSchema.index({ user: 1 });
userRoleSchema.index({ role: 1 });
const UserRole = (0, mongoose_1.model)('UserRole', userRoleSchema);
exports.default = UserRole;
