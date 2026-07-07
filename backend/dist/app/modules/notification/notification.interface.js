"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENUM_NOTIFICATION_STATUS = exports.ENUM_NOTIFICATION_TYPE = void 0;
// Enum for notification type
var ENUM_NOTIFICATION_TYPE;
(function (ENUM_NOTIFICATION_TYPE) {
    ENUM_NOTIFICATION_TYPE["GENERAL"] = "general";
    ENUM_NOTIFICATION_TYPE["ALERT"] = "alert";
    ENUM_NOTIFICATION_TYPE["UPDATE"] = "update";
    ENUM_NOTIFICATION_TYPE["MESSAGE"] = "message";
    ENUM_NOTIFICATION_TYPE["INVESTMENT"] = "investment";
})(ENUM_NOTIFICATION_TYPE || (exports.ENUM_NOTIFICATION_TYPE = ENUM_NOTIFICATION_TYPE = {}));
// Enum for notification status
var ENUM_NOTIFICATION_STATUS;
(function (ENUM_NOTIFICATION_STATUS) {
    ENUM_NOTIFICATION_STATUS["READ"] = "read";
    ENUM_NOTIFICATION_STATUS["UNREAD"] = "unread";
})(ENUM_NOTIFICATION_STATUS || (exports.ENUM_NOTIFICATION_STATUS = ENUM_NOTIFICATION_STATUS = {}));
