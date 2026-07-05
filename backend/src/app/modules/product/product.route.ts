import { Router } from 'express'
import { ProductController } from './product.controller'
import validateRequest from '../../middlewares/validateRequest'
import {
  createProductValidation,
  updateProductValidation,
} from './product.validation'
import { auth, authorize } from '../../middlewares/auth'
import { uploadSingle } from '../../middlewares/multer'

const router = Router()

router.post(
  '/',
  auth,
  authorize('product.create'),
  uploadSingle('image'),
  validateRequest(createProductValidation),
  ProductController.createProduct,
)

router.get(
  '/',
  auth,
  authorize('product.read'),
  ProductController.getAllProducts,
)

router.get(
  '/:id',
  auth,
  authorize('product.read'),
  ProductController.getProductById,
)

router.put(
  '/:id',
  auth,
  authorize('product.update'),
  uploadSingle('image'),
  validateRequest(updateProductValidation),
  ProductController.updateProduct,
)

router.patch(
  '/:id/delete',
  auth,
  authorize('product.delete'),
  ProductController.deleteProduct,
)

export default router
