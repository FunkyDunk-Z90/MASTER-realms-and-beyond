// src/env.ts
import { cleanEnv, str, port } from 'envalid'

export const env = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production', 'test'] }),
    PORT: port({ default: 8000 }),
    DATABASE: str(),
    DATABASE_PASSWORD: str(),
    JWT_SECRET: str(),
    JWT_COOKIE_SECRET: str(),
    JWT_EXPIRES_IN: str({ default: '7d' }),
    JWT_COOKIE_EXPIRES_IN: str({ default: '7' }),
    // Optional — only required when Cloudinary upload features are used
    CLOUDINARY_NAME: str({ default: '' }),
    CLOUDINARY_API_KEY: str({ default: '' }),
    CLOUDINARY_SECRET: str({ default: '' }),
    CLOUDINARY_URL: str({ default: '' }),
    USER_DEFAULT_AVATAR: str({ default: '' }),
    // Optional — only required when email sending features are used
    // RESEND_API_KEY: str({ default: '' }),
    MAILTRAP_HOST: str({ default: '' }),
    MAILTRAP_PORT: port({ default: 2525 }),
    MAILTRAP_PASSWORD: str({ default: '' }),
    MAILTRAP_USERNAME: str({ default: '' }),
    FRONTEND_URL: str({ default: 'http://localhost:3000' }),
})
