import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import session from 'express-session'
import MongoStore from 'connect-mongo'

import { errorHandler } from '@rnb/middleware'
import { env } from './config/validateEnv'

import identityRouter from './routes/identityRouter'
import authorizeRouter from './routes/authorize'
import tokenRouter from './routes/token'
import registerRouter from './routes/register'
import logoutRouter from './routes/logout'
import jwksRouter from './routes/jwks'

const app = express()

app.use(morgan('dev'))

// CORS — derived from ALLOWED_ORIGINS env var (comma-separated list)
app.use(
    cors({
        origin: env.ALLOWED_ORIGINS,
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ─── SSO Session ──────────────────────────────────────────────────────────────
// Lives only on auth.realmsandbeyond.com (not shared across domains).
// Tracks the user's global R&B identity across all member apps.
// In production: set cookie.domain to '.realmsandbeyond.com' (cross-subdomain).

const mongoUri = env.DATABASE.replace('<PASSWORD>', env.DATABASE_PASSWORD)

app.use(
    session({
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: mongoUri }),
        cookie: {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            // In production: domain: '.realmsandbeyond.com'
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        },
    })
)

// ─── OAuth 2.0 + PKCE Routes ──────────────────────────────────────────────────

// GET  /authorize  — validate client + store intent → SSO fast-path or redirect to login UI
// POST /authorize  — process login form, issue auth code, redirect to member app callback
app.use('/authorize', authorizeRouter)

// POST /token          — code + PKCE verifier → RS256 JWT + refresh token
// POST /token/refresh  — refresh token rotation → new access + refresh tokens
app.use('/token', tokenRouter)

// GET  /register  — redirect to rnb-auth register UI
// POST /register  — create Identity, issue auth code, redirect to member app callback
app.use('/register', registerRouter)

// POST /logout  — destroy SSO session (global logout)
app.use('/logout', logoutRouter)

// GET /.well-known/jwks.json             — public key set for RS256 JWT verification
// GET /.well-known/openid-configuration  — OIDC discovery document
app.use('/.well-known', jwksRouter)

// ─── Identity API (account portal) ───────────────────────────────────────────
// Protected by HS256 JWT auth_token cookie.
// Used directly by rnb-auth account portal — not part of the OAuth flow.
app.use('/api/v1/user', identityRouter)

app.use(errorHandler)

export default app
