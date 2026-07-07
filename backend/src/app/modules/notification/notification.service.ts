import { ENUM_USER_ROLE } from '../../../enums/role'
import Notification from './notification.model'

const createNotification = async (notificationPayload: any) => {
  const {
    message,
    roles = [ENUM_USER_ROLE.ADMIN],
    userId = null,
    adminUserId = null,
    type = 'general',
    io,
  } = notificationPayload
  const notification = new Notification({
    message,
    roles,
    user: userId,
    adminUser: adminUserId,
    type,
  })

  // Save the notification to the database
  await notification.save()

  const sendNotification = {
    message: notification.message,
    timestamp: notification.timestamp,
  }
  // Emit the notification to users with the specified roles via Socket.IO
  roles.forEach((role: string) => {
    if (role === ENUM_USER_ROLE.ADMIN) {
      io.emit('receiveAdminNotification', sendNotification)
    } else if (role === ENUM_USER_ROLE.MANAGER) {
      io.emit('receiveManagerNotification', sendNotification)
    } else if (role === ENUM_USER_ROLE.EMPLOYEE) {
      io.emit('receiveEmployeeNotification', sendNotification)
    }
  })
}

const getNotification = async (payload: any) => {
  let query = {
    status: 'unread',
    roles: { $in: payload.roles },
  } as any

  const role = payload.roles.includes('User')

  if (role) {
    query.user = payload?.userId
  }
  const notifications = await Notification.find(query).sort({ timestamp: -1 })

  return notifications
}

const updateNotification = async (id: string) => {
  const query = {
    _id: id,
  }

  const notifications = await Notification.updateOne(query, {
    $set: {
      status: 'read',
      dismissed: true,
    },
  })

  return notifications
}
const updateAllNotification = async (payload: any) => {
  const notifications = await Notification.updateMany(
    { user: payload?.user, status: 'unread' },
    {
      $set: {
        status: 'read',
        dismissed: true,
      },
    },
  )

  return notifications
}

export const NotificationService = {
  createNotification,
  getNotification,
  updateNotification,
  updateAllNotification,
}
