import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { NotificationService } from './notification.service'
import { ENUM_USER_ROLE } from '../../../enums/role'

const createNotification = catchAsync(async (req, res) => {
  const io = req.app.get('socketio')

  const message = 'This is an important update for admins!'
  const roles = [ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MANAGER]
  const notificationPayload = {
    message,
    roles,
    io,
  }
  const notifications =
    await NotificationService.createNotification(notificationPayload)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification Create Successfully',
    data: notifications,
  })
})

const getNotification = catchAsync(async (req, res) => {
  const query = req.query

  const notifications = await NotificationService.getNotification(query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Notifications Successfully',
    data: notifications,
  })
})

const updateNotification = catchAsync(async (req, res) => {
  const id = req.params.id

  const notifications = await NotificationService.updateNotification(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Notifications Successfully',
    data: notifications,
  })
})

const updateAllNotification = catchAsync(async (req, res) => {
  const notifications = await NotificationService.updateAllNotification(
    req.body,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Update Successfully',
    data: notifications,
  })
})

export const notificationController = {
  createNotification,
  getNotification,
  updateNotification,
  updateAllNotification,
}
