"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const location_controller_1 = require("./location.controller");
const location_validation_1 = require("./location.validation");
const router = express_1.default.Router();
//  Public Routes
router.get('/', location_controller_1.LocationController.getAllLocations);
router.get('/:id', location_controller_1.LocationController.getSingleLocation);
//  Admin Routes
router.post('/', 
// auth(USER_ROLE.ADMIN), // Uncomment if using role system
(0, validateRequest_1.default)(location_validation_1.LocationValidation.createLocationZodSchema), location_controller_1.LocationController.createLocation);
router.delete('/:id', 
// auth(USER_ROLE.ADMIN),
location_controller_1.LocationController.deleteLocation);
exports.LocationRoutes = router;
