import { z } from 'zod'

export const loginValidation = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const refreshTokenValidation = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
})
