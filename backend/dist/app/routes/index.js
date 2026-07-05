"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const job_routes_1 = require("../modules/job/job.routes");
const location_route_1 = require("../modules/location/location.route");
const application_routes_1 = require("../modules/application/application.routes");
const user_route_1 = require("../modules/clientRegistration/user.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/jobs',
        route: job_routes_1.JobRoutes,
    },
    {
        path: '/locations',
        route: location_route_1.LocationRoutes,
    },
    {
        path: '/applications',
        route: application_routes_1.ApplicationRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
