"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLocationService = exports.getSingleLocationService = exports.getAllLocationsService = exports.createLocationService = void 0;
const location_model_1 = require("./location.model");
const createLocationService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // prevent duplicate
    const existing = yield location_model_1.Location.findOne({
        city: payload.city,
        country: payload.country,
    });
    if (existing) {
        throw new Error('Location already exists');
    }
    const location = yield location_model_1.Location.create(payload);
    return location;
});
exports.createLocationService = createLocationService;
const getAllLocationsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = '1', limit = '10', search } = query;
    const filter = {};
    if (search) {
        filter.$or = [
            { city: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } },
        ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const locations = yield location_model_1.Location.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });
    const total = yield location_model_1.Location.countDocuments(filter);
    return { locations, total };
});
exports.getAllLocationsService = getAllLocationsService;
const getSingleLocationService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const location = yield location_model_1.Location.findById(id);
    if (!location) {
        throw new Error('Location not found');
    }
    return location;
});
exports.getSingleLocationService = getSingleLocationService;
const deleteLocationService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const location = yield location_model_1.Location.findByIdAndDelete(id);
    if (!location) {
        throw new Error('Location not found');
    }
    return location;
});
exports.deleteLocationService = deleteLocationService;
