"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const rolePermissionSchema = new mongoose_1.Schema({
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
    permission: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Permission',
        required: true,
    },
    allowed: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
rolePermissionSchema.index({ role: 1, permission: 1 }, { unique: true });
rolePermissionSchema.index({ role: 1 });
rolePermissionSchema.index({ permission: 1 });
const RolePermission = (0, mongoose_1.model)('RolePermission', rolePermissionSchema);
exports.default = RolePermission;
