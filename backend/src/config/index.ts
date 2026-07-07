import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  jwt: {
    secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_secret: process.env.REFRESH_TOKEN_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  },

  cloudflare_r2: {
    access_key_id: process.env.R2_ACCESS_KEY_ID,
    secret_access_key: process.env.R2_SECRET_ACCESS_KEY,
    bucket_name: process.env.R2_BUCKET_NAME,
    endpoint: process.env.R2_ENDPOINT,
    public_url: process.env.R2_PUBLIC_URL,
  },

  allowed_origins: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
  ],

  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  },
}
