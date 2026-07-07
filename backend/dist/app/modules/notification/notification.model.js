"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const notification_interface_1 = require("./notification.interface");
const role_1 = require("../../../enums/role");
const notificationSchema = new mongoose_1.Schema({
    message: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    investment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Investment',
    },
    project: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
    },
    adminUser: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'AdminUser',
        },
    ],
    roles: {
        type: [String],
        enum: Object.values(role_1.ENUM_USER_ROLE),
        default: [role_1.ENUM_USER_ROLE.ADMIN],
    },
    type: {
        type: String,
        enum: Object.values(notification_interface_1.ENUM_NOTIFICATION_TYPE),
        default: notification_interface_1.ENUM_NOTIFICATION_TYPE.GENERAL,
    },
    status: {
        type: String,
        enum: Object.values(notification_interface_1.ENUM_NOTIFICATION_STATUS),
        default: notification_interface_1.ENUM_NOTIFICATION_STATUS.UNREAD,
    },
    dismissed: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    readBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'AdminUser',
        },
    ],
}, {
    timestamps: true,
});
// Model
const Notification = mongoose_1.default.model('Notification', notificationSchema);
exports.default = Notification;
// server.js or another controller file
// import Notification from './models/Notification.js';
// import User from './models/User.js';
// import io from 'socket.io';  // Assuming you're using Socket.IO
// // Create and send a notification for specific roles
// const sendNotification = async (
//   message,
//   roles = ["user"],
//   userId = null,
//   type = "general"
// ) => {
//   try {
//     // Create a new notification document
//     const notification = new Notification({
//       message,
//       roles, // Assign roles
//       user: userId, // If you have a specific user
//       type, // Specify the type of notification
//     });
//     // Save the notification to the database
//     await notification.save();
//     // Emit the notification to users with the specified roles via Socket.IO
//     roles.forEach((role) => {
//       if (role === "admin") {
//         io.emit("receiveAdminNotification", notification);
//       } else if (role === "superadmin") {
//         io.emit("receiveSuperAdminNotification", notification);
//       } else if (role === "PRManager") {
//         io.emit("receivePRManagerNotification", notification);
//       } else if (role === "user") {
//         io.emit("receiveUserNotification", notification);
//       }
//     });
//     console.log("Notification sent:", notification);
//   } catch (err) {
//     console.error("Error sending notification:", err);
//   }
// };
// // // Example usage
// sendNotification(
//   "This is an important update for admins!",
//   ["admin", "superadmin"],
//   null,
//   "alert"
// );
// Fetch notifications for a specific role
// const getNotificationsForRole = async (role) => {
//   try {
//     const notifications = await Notification.find({
//       roles: { $in: [role] },  // Find notifications with the specified role
//     }).sort({ timestamp: -1 });  // Sort by the latest notifications
//     console.log('Notifications for role', role, notifications);
//     return notifications;
//   } catch (err) {
//     console.error('Error fetching notifications:', err);
//   }
// };
// // Example usage
// getNotificationsForRole('admin');  // Get all admin notifications
// Mark a notification as read for a specific user
// const markNotificationAsRead = async (notificationId, userId) => {
//   try {
//     const notification = await Notification.findById(notificationId);
//     // Add the user to the readBy array (if not already there)
//     if (!notification.readBy.includes(userId)) {
//       notification.readBy.push(userId);
//     }
//     // Update the status and save the notification
//     notification.status = 'read';
//     await notification.save();
//     console.log('Notification marked as read:', notification);
//   } catch (err) {
//     console.error('Error marking notification as read:', err);
//   }
// };
// // Example usage
// markNotificationAsRead('60d5c8f0f88b6e1a3484c9f2', '60d5c8f0f88b6e1a3484c9f1');  // Mark notification as read for a specific user
// Hooks
// hooks/useSocket.js
// import { useEffect } from 'react';
// import io from 'socket.io-client';
// let socket;
// const useSocket = (role) => {
//   useEffect(() => {
//     socket = io('http://localhost:3001');  // Replace with your server URL
//     // Listen for notifications based on the user's role
//     if (role === 'admin') {
//       socket.on('receiveAdminNotification', (notification) => {
//         console.log('Admin Notification:', notification);
//         // Handle admin-specific notification (e.g., display it in the UI)
//       });
//     } else if (role === 'superadmin') {
//       socket.on('receiveSuperAdminNotification', (notification) => {
//         console.log('SuperAdmin Notification:', notification);
//         // Handle superadmin-specific notification
//       });
//     } else if (role === 'PRManager') {
//       socket.on('receivePRManagerNotification', (notification) => {
//         console.log('PRManager Notification:', notification);
//         // Handle PRManager-specific notification
//       });
//     } else {
//       socket.on('receiveUserNotification', (notification) => {
//         console.log('User Notification:', notification);
//         // Handle general user notification
//       });
//     }
//     return () => {
//       socket.disconnect();
//     };
//   }, [role]);
//   return {};
// };
// export default useSocket;
