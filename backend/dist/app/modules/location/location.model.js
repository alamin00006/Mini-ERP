"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = void 0;
const mongoose_1 = require("mongoose");
const locationSchema = new mongoose_1.Schema({
    city: {
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });
locationSchema.index({ city: 1, country: 1 }, { unique: true });
exports.Location = (0, mongoose_1.model)('Location', locationSchema);
