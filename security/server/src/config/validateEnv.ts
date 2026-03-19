import { z } from 'zod'

// Switched from envalid to Zod v4 — schema now lives in src/schemas/env.ts.
// This file exports the validated `env` object for use across the server.

const EnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    PORT: z.coerce.number().int().default(2611),
    DATABASE: z.string().min(1),
    DATABASE_PASSWORD: z.string().min(1),

    // ── SSO Session ───────────────────────────────────────────────────────────
    SESSION_SECRET: z.string().min(32),

    // ── RS256 key ID ──────────────────────────────────────────────────────────
    // Generate: node -e "console.log(require('crypto').randomBytes(8).toString('hex'))"
    JWT_KEY_ID: z.string().min(1),

    // URL of the rnb-auth Next.js login/register UI
    AUTH_UI_URL: z.string().url().default('http://localhost:3001'),

    // Comma-separated CORS origins — parsed into an array
    ALLOWED_ORIGINS: z
        .string()
        .default('http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003')
        .transform((v) => v.split(',')),

    // ── Identity API (account portal — HS256) ────────────────────────────────
    JWT_SECRET: z.string().min(32),
    JWT_COOKIE_SECRET: z.string().min(16),
    JWT_EXPIRES_IN: z.string().default('7d'),
    JWT_COOKIE_EXPIRES_IN: z.string().default('7d'),

    FRONTEND_URL: z.string().url().default('http://localhost:3000'),

    // ── Optional services ─────────────────────────────────────────────────────
    CLOUDINARY_NAME: z.string().default(''),
    CLOUDINARY_API_KEY: z.string().default(''),
    CLOUDINARY_SECRET: z.string().default(''),
    CLOUDINARY_URL: z.string().default(''),
    USER_DEFAULT_AVATAR: z.string().default(''),
    MAILTRAP_HOST: z.string().default(''),
    MAILTRAP_PORT: z.coerce.number().int().default(2525),
    MAILTRAP_PASSWORD: z.string().default(''),
    MAILTRAP_USERNAME: z.string().default(''),
})

const result = EnvSchema.safeParse(process.env)

if (!result.success) {
    console.error('Invalid environment variables:')
    console.error(
        result.error.issues
            .map((i) => `  ${i.path.join('.')}: ${i.message}`)
            .join('\n')
    )
    process.exit(1)
}

export const env = result.data
