import { z } from 'zod'

export const createRoleValidation = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
})

export const updateRoleValidation = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
})
