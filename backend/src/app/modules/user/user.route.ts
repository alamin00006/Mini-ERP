import { Router } from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middlewares/validateRequest'
import { createUserValidation, updateUserValidation } from './user.validation'
import { auth, authorize } from '../../middlewares/auth'

const router = Router()

router.post(
  '/',
  auth,
  authorize('user.create'),
  validateRequest(createUserValidation),
  UserController.createUser,
)

router.get('/', auth, authorize('user.read'), UserController.getAllUsers)

router.get('/:id', auth, authorize('user.read'), UserController.getUserById)

router.put(
  '/:id',
  auth,
  authorize('user.update'),
  validateRequest(updateUserValidation),
  UserController.updateUser,
)

router.patch(
  '/:id/toggle-status',
  auth,
  authorize('user.delete'),
  UserController.toggleUserStatus,
)

export default router
