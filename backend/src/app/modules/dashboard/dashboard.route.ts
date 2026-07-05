import { Router } from 'express'
import { DashboardController } from './dashboard.controller'
import { auth, authorize } from '../../middlewares/auth'

const router = Router()

router.get(
  '/',
  auth,
  authorize('dashboard.read'),
  DashboardController.getDashboardStats,
)

export default router
