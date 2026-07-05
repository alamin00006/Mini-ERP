import express from 'express'
import { JobRoutes } from '../modules/job/job.routes'
import { LocationRoutes } from '../modules/location/location.route'
import { ApplicationRoutes } from '../modules/application/application.routes'
import { UserRoutes } from '../modules/clientRegistration/user.route'
const router = express.Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/jobs',
    route: JobRoutes,
  },
  {
    path: '/locations',
    route: LocationRoutes,
  },
  {
    path: '/applications',
    route: ApplicationRoutes,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
