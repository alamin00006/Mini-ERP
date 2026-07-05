import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import http from 'http'
import httpStatus from 'http-status'
import routes from './app/routes/index'
import globalErrorHandler from './errors/globalErrorHandler'

import { databaseConnect } from './helpers/dbConnect'

const app = express()
const server = http.createServer(app)

// ============================
// Allowed Origins
// ============================
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:3000',
  'https://quick-hire-2wzg.vercel.app',
  'https://quick-hire-xrjd.vercel.app',
]

// ============================
// Middleware
// ============================
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
    optionsSuccessStatus: 200,
  }),
)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ============================
// Routes
// ============================
app.get('/', (req, res) => {
  res.status(httpStatus.BAD_REQUEST).send('Bad Request!')
})

app.use('/api/v1', routes)

// ============================
// Error Handling
// ============================
app.use(globalErrorHandler)

// 404 Handler
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  })
  next()
})

// ============================
// Process Error Handling
// ============================
process.on('uncaughtException', (error: any) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (error: any) => {
  console.error('Unhandled Rejection:', error.message)
  if (server) {
    server.close(() => process.exit(1))
  } else {
    process.exit(1)
  }
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  if (server) {
    server.close(() => {
      console.log('Server closed.')
      process.exit(0)
    })
  }
})

// ============================
// Start Server
// ============================
databaseConnect(server)

export { app, server }
