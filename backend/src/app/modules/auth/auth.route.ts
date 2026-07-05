import { Router } from 'express'
import { AuthController } from './auth.controller'
import validateRequest from '../../middlewares/validateRequest'
import { loginValidation } from './auth.validation'

const router = Router()

router.post(
  '/login',
  validateRequest(loginValidation),
  AuthController.loginUser,
)

export default router
