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
const Role = (0, mongoose_1.model)('Role', roleSchema);
exports.default = Role;
