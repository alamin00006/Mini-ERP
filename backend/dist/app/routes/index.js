"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const user_route_1 = __importDefault(require("../modules/user/user.route"));
const role_route_1 = __importDefault(require("../modules/role/role.route"));
const permission_route_1 = __importDefault(require("../modules/permission/permission.route"));
const product_route_1 = __importDefault(require("../modules/product/product.route"));
const sale_route_1 = __importDefault(require("../modules/sale/sale.route"));
const dashboard_route_1 = __importDefault(require("../modules/dashboard/dashboard.route"));
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.default,
    },
    {
        path: '/users',
        route: user_route_1.default,
    },
    {
        path: '/roles',
        route: role_route_1.default,
    },
    {
        path: '/permissions',
        route: permission_route_1.default,
    },
    {
        path: '/products',
        route: product_route_1.default,
    },
    {
        path: '/sales',
        route: sale_route_1.default,
    },
    {
        path: '/dashboard',
        route: dashboard_route_1.default,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
