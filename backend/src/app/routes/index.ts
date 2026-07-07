import express from 'express'
import AuthRoutes from '../modules/auth/auth.route'
import UserRoutes from '../modules/user/user.route'
import RoleRoutes from '../modules/role/role.route'
import PermissionRoutes from '../modules/permission/permission.route'
import CategoryRoutes from '../modules/category/category.route'
import ProductRoutes from '../modules/product/product.route'
import SaleRoutes from '../modules/sale/sale.route'
import DashboardRoutes from '../modules/dashboard/dashboard.route'
import { notificationRoutes } from '../modules/notification/notification.route'

const router = express.Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/roles',
    route: RoleRoutes,
  },
  {
    path: '/permissions',
    route: PermissionRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/sales',
    route: SaleRoutes,
  },
  {
    path: '/dashboard',
    route: DashboardRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
