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
    expires_in: process.env.JWT_EXPIRES_IN,
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
}
