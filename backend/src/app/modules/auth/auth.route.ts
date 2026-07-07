import { Router } from 'express'
import { AuthController } from './auth.controller'
import validateRequest from '../../middlewares/validateRequest'
import { loginValidation } from './auth.validation'
import { auth } from '../../middlewares/auth'

const router = Router()

router.post(
  '/login',
  validateRequest(loginValidation),
  AuthController.loginUser,
)

router.post('/refresh-token', AuthController.refreshToken)

router.post('/logout', auth, AuthController.logoutUser)

export default router
