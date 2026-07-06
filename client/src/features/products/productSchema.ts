import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  sku: z.string().trim().min(1, "SKU is required").max(60),
  category: z.string().trim().min(1, "Category is required").max(60),
  purchasePrice: z.coerce.number().min(0, "Must be ≥ 0"),
  sellingPrice: z.coerce.number().min(0, "Must be ≥ 0"),
  stockQuantity: z.coerce.number().int().min(0, "Must be ≥ 0"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
