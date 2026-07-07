import express from 'express'
import { notificationController } from './notification.controller'

const router = express.Router()
router.patch('/read-all', notificationController.updateAllNotification)

router.get('/', notificationController.getNotification)
router.patch('/:id/read', notificationController.updateNotification)

export const notificationRoutes = router
