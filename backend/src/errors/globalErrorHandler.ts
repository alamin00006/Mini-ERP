import { ErrorRequestHandler } from 'express'

import ApiError from './ApiError'
import { TErrorSources } from '../shared/interface/error'
import handleValidationError from './handleValidationError'
import handleCastError from './handleCastError'
import handleDuplicateError from './handleDuplicateError'
import config from '../config'

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  // Default values
  let statusCode = 500
  let message = 'Something went wrong'
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ]

  // Determine error type for switch
  const errorType = (() => {
    if (err?.name === 'ValidationError') return 'ValidationError'
    if (err?.name === 'CastError') return 'CastError'
    if (err?.code === 11000) return 'DuplicateError'
    if (err instanceof ApiError) return 'ApiError'
    if (err instanceof Error) return 'GenericError'
    return 'UnknownError'
  })()

  // Handle errors using switch
  switch (errorType) {
    case 'ValidationError':
      const validationError = handleValidationError(err)
      statusCode = validationError.statusCode
      message = validationError.message
      errorSources = validationError.errorSources
      break

    case 'CastError':
      const castError = handleCastError(err)
      statusCode = castError.statusCode
      message = castError.message
      errorSources = castError.errorSources
      break

    case 'DuplicateError':
      const duplicateError = handleDuplicateError(err)
      statusCode = duplicateError.statusCode
      message = duplicateError.message
      errorSources = duplicateError.errorSources
      break

    case 'ApiError':
      statusCode = err.statusCode
      message = err.message
      errorSources = [
        {
          path: '',
          message: err.message,
        },
      ]
      break

    case 'GenericError':
      message = err.message
      errorSources = [
        {
          path: '',
          message: err.message,
        },
      ]
      break

    default:
      // UnknownError: Use default values
      break
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.env === 'development' ? err?.stack : null,
  })

  return // Explicitly return void
}

export default globalErrorHandler
