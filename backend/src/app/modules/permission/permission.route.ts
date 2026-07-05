import { Router } from 'express'
import { PermissionController } from './permission.controller'
import validateRequest from '../../middlewares/validateRequest'
import {
  createPermissionValidation,
  updatePermissionValidation,
} from './permission.validation'
import { auth, authorize } from '../../middlewares/auth'

const router = Router()

router.post(
  '/',
  auth,
  authorize('permission.create'),
  validateRequest(createPermissionValidation),
  PermissionController.createPermission,
)

router.get(
  '/',
  auth,
  authorize('permission.read'),
  PermissionController.getAllPermissions,
)

router.get(
  '/:id',
  auth,
  authorize('permission.read'),
  PermissionController.getPermissionById,
)

router.put(
  '/:id',
  auth,
  authorize('permission.update'),
  validateRequest(updatePermissionValidation),
  PermissionController.updatePermission,
)

router.delete(
  '/:id',
  auth,
  authorize('permission.delete'),
  PermissionController.deletePermission,
)

export default router
