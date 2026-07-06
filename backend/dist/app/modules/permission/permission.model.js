"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const permissionSchema = new mongoose_1.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    group: {
        type: String,
        trim: true,
    },
    module: {
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
permissionSchema.index({ group: 1 });
const Permission = (0, mongoose_1.model)('Permission', permissionSchema);
exports.default = Permission;
