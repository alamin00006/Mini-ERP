import { JwtPayload } from 'jsonwebtoken'
import mongoose from 'mongoose'
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload
    }
  }
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

export {}
