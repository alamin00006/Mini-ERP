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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const role_1 = require("../../../enums/role");
const notification_model_1 = __importDefault(require("./notification.model"));
const createNotification = (notificationPayload) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, roles = [role_1.ENUM_USER_ROLE.ADMIN], userId = null, adminUserId = null, type = 'general', io, } = notificationPayload;
    const notification = new notification_model_1.default({
        message,
        roles,
        user: userId,
        adminUser: adminUserId,
        type,
    });
    // Save the notification to the database
    yield notification.save();
    const sendNotification = {
        message: notification.message,
        timestamp: notification.timestamp,
    };
    // Emit the notification to users with the specified roles via Socket.IO
    roles.forEach((role) => {
        if (role === role_1.ENUM_USER_ROLE.ADMIN) {
            io.emit('receiveAdminNotification', sendNotification);
        }
        else if (role === role_1.ENUM_USER_ROLE.MANAGER) {
            io.emit('receiveManagerNotification', sendNotification);
        }
        else if (role === role_1.ENUM_USER_ROLE.EMPLOYEE) {
            io.emit('receiveEmployeeNotification', sendNotification);
        }
    });
});
const getNotification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Default to Admin role if no roles provided
    const roles = (payload === null || payload === void 0 ? void 0 : payload.roles) || [role_1.ENUM_USER_ROLE.ADMIN];
    let query = {
        // status: 'unread',
        roles: { $in: roles },
    };
    // Check if User role is in the array
    const hasUserRole = roles.includes('User') || roles.includes(role_1.ENUM_USER_ROLE.ADMIN);
    if (hasUserRole && (payload === null || payload === void 0 ? void 0 : payload.userId)) {
        query.user = payload.userId;
    }
    const notifications = yield notification_model_1.default.find(query).sort({ timestamp: -1 });
    return notifications;
});
const updateNotification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        _id: id,
    };
    const notifications = yield notification_model_1.default.updateOne(query, {
        $set: {
            status: 'read',
            dismissed: true,
        },
    });
    return notifications;
});
const updateAllNotification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield notification_model_1.default.updateMany({ user: payload === null || payload === void 0 ? void 0 : payload.user, status: 'unread' }, {
        $set: {
            status: 'read',
            dismissed: true,
        },
    });
    return notifications;
});
exports.NotificationService = {
    createNotification,
    getNotification,
    updateNotification,
    updateAllNotification,
};
