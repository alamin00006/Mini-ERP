import { z } from 'zod'

export const createProductValidation = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sku: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  purchasePrice: z.coerce
    .number()
    .min(0, 'Purchase price must be greater than or equal to 0'),
  sellingPrice: z.coerce
    .number()
    .min(0, 'Selling price must be greater than or equal to 0'),
  stockQuantity: z.coerce
    .number()
    .min(0, 'Stock quantity must be greater than or equal to 0'),
})

export const updateProductValidation = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  sku: z.string().min(2, 'SKU must be at least 2 characters').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  purchasePrice: z.coerce
    .number()
    .min(0, 'Purchase price must be greater than or equal to 0')
    .optional(),
  sellingPrice: z.coerce
    .number()
    .min(0, 'Selling price must be greater than or equal to 0')
    .optional(),
  stockQuantity: z.coerce
    .number()
    .min(0, 'Stock quantity must be greater than or equal to 0')
    .optional(),
})
