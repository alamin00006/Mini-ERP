import { Router } from 'express'
import { RoleController } from './role.controller'
import validateRequest from '../../middlewares/validateRequest'
import { createRoleValidation, updateRoleValidation } from './role.validation'
import { auth, authorize } from '../../middlewares/auth'

const router = Router()

router.post(
  '/',
  auth,
  authorize('role.create'),
  validateRequest(createRoleValidation),
  RoleController.createRole,
)

router.get('/', auth, authorize('role.read'), RoleController.getAllRoles)

router.get('/:id', auth, authorize('role.read'), RoleController.getRoleById)

router.put(
  '/:id',
  auth,
  authorize('role.update'),
  validateRequest(updateRoleValidation),
  RoleController.updateRole,
)

router.patch(
  '/:id/deactivate',
  auth,
  authorize('role.delete'),
  RoleController.deactivateRole,
)

export default router
