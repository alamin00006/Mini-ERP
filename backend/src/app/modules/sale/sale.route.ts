import { Router } from 'express'
import { SaleController } from './sale.controller'
import validateRequest from '../../middlewares/validateRequest'
import { createSaleValidation } from './sale.validation'
import { auth, authorize } from '../../middlewares/auth'

const router = Router()

router.post(
  '/',
  auth,
  authorize('sale.create'),
  validateRequest(createSaleValidation),
  SaleController.createSale,
)

router.get('/', auth, authorize('sale.read'), SaleController.getSales)

export default router
