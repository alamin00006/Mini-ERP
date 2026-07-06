import { Router } from 'express'
import { CategoryController } from './category.controller'
import validateRequest from '../../middlewares/validateRequest'
import {
  createCategoryValidation,
  updateCategoryValidation,
} from './category.validation'
import { auth, authorize } from '../../middlewares/auth'

const router = Router()

router.post(
  '/',
  auth,
  authorize('category.create'),
  validateRequest(createCategoryValidation),
  CategoryController.createCategory,
)

router.get(
  '/',
  auth,
  authorize('category.read'),
  CategoryController.getAllCategories,
)

router.get(
  '/:id',
  auth,
  authorize('category.read'),
  CategoryController.getCategoryById,
)

router.put(
  '/:id',
  auth,
  authorize('category.update'),
  validateRequest(updateCategoryValidation),
  CategoryController.updateCategory,
)

router.patch(
  '/:id/delete',
  auth,
  authorize('category.delete'),
  CategoryController.deleteCategory,
)

export default router
