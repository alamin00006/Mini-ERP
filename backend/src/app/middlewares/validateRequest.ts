import { ZodType } from 'zod'
import { Request, Response, NextFunction } from 'express'
import ApiError from '../../errors/ApiError'

const validateRequest =
  <T>(schema: ZodType<T>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request
      await schema.parseAsync({
        body: req.body,
      })
      next()
    } catch (err: any) {
      if (err?.issues) {
        // Transform Zod validation errors into ApiError
        const messages = err.issues
          .map((issue: any) => `${issue.path.join('.')} - ${issue.message}`)
          .join(', ')
        return next(new ApiError(400, `Validation failed: ${messages}`))
      }
      // Fallback for unexpected errors
      return next(new ApiError(500, err.message))
    }
  }

export default validateRequest
