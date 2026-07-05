import { z } from 'zod'

export const createPermissionValidation = z.object({
  key: z.string().min(2, 'Key must be at least 2 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  group: z.string().optional(),
  module: z.string().optional(),
})

export const updatePermissionValidation = z.object({
  key: z.string().min(2, 'Key must be at least 2 characters').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
  group: z.string().optional(),
  module: z.string().optional(),
})
