import Product from '../app/modules/product/product.model'

/**
 * Generates a unique SKU (Stock Keeping Unit) for products
 * Format: PRD-000001, PRD-000002, etc.
 * @returns Promise<string> - Generated SKU
 */
export const generateSKU = async (): Promise<string> => {
  const lastProduct = await Product.findOne().sort({ createdAt: -1 })
  const prefix = 'PRD'

  if (!lastProduct) {
    return `${prefix}-000001`
  }

  const lastSKU = lastProduct.sku
  const match = lastSKU.match(/^PRD-(\d+)$/)

  if (match) {
    const lastNumber = parseInt(match[1], 10)
    const nextNumber = lastNumber + 1
    return `${prefix}-${String(nextNumber).padStart(6, '0')}`
  }

  return `${prefix}-000001`
}
