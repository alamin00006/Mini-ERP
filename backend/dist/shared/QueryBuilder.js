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
class QueryBuilder {
    constructor(model, query) {
        this.options = {};
        this.populate = [];
        this.model = model;
        this.query = query;
    }
    search(searchFields = [], searchTerm) {
        if (!searchTerm || searchFields.length === 0)
            return this;
        const searchRegex = new RegExp(searchTerm, 'i');
        const searchQuery = searchFields.map(field => ({
            [field]: { $regex: searchRegex },
        }));
        this.query.$or = searchQuery;
        return this;
    }
    filter(filterOptions = {}) {
        if (Object.keys(filterOptions).length === 0)
            return this;
        Object.entries(filterOptions).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                ;
                this.query[key] = value;
            }
        });
        return this;
    }
    sort(sortBy, sortOrder = 'desc') {
        if (!sortBy)
            return this;
        this.options.sort = { [sortBy]: sortOrder };
        return this;
    }
    pagination(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        this.options.skip = skip;
        this.options.limit = limit;
        return this;
    }
    select(fields = '') {
        if (!fields)
            return this;
        this.options.projection = fields.split(',').join(' ');
        return this;
    }
    addPopulate(path, select) {
        this.populate.push({ path, select });
        return this;
    }
    getTotalCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.countDocuments(this.query);
        });
    }
    getPaginatedData() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.model
                .find(this.query, '', this.options)
                .populate(this.populate);
            const total = yield this.getTotalCount();
            const page = this.options.skip
                ? Math.floor(this.options.skip / (this.options.limit || 10)) + 1
                : 1;
            const limit = this.options.limit || 10;
            const totalPages = Math.ceil(total / limit);
            return {
                data,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            };
        });
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find(this.query, '', this.options).populate(this.populate);
        });
    }
    getSingleData() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne(this.query).populate(this.populate);
        });
    }
}
exports.default = QueryBuilder;
