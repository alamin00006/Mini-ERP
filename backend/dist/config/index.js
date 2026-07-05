"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
exports.default = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.MONGO_URI,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt: {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expires_in: process.env.JWT_EXPIRES_IN,
    },
    cloudflare_r2: {
        access_key_id: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secret_access_key: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        bucket_name: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
        public_url: process.env.CLOUDFLARE_R2_PUBLIC_URL,
    },
};
