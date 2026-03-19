import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import session from 'express-session'
import MongoStore from 'connect-mongo'

import { errorHandler } from '@rnb/middleware'
import { env } from './config/validateEnv'

import identityRouter from './routes/identityRouter'
import developerRouter from './routes/developer'
import authorizeRouter from './routes/authorize'
import tokenRouter from './routes/token'
import registerRouter from './routes/register'
import logoutRouter from './routes/logout'
import jwksRouter from './routes/jwks'

const app = express()

app.use(morgan('dev'))

app.use(
    cors({
        origin: env.ALLOWED_ORIGINS,
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
)

app.use(express.json({ limit: '100mb' }))
app.use(cookieParser())

// ── SSO session ───────────────────────────────────────────────────────────────
// Stored in MongoDB (same connection as the app); 30-day rolling TTL.
// Used to track the global R&B auth session across member-app logins.

const mongoUri = env.DATABASE.replace('<PASSWORD>', env.DATABASE_PASSWORD)

app.use(
    session({
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: mongoUri,
            collectionName: 'sso_sessions',
            ttl: 60 * 60 * 24 * 30, // 30 days in seconds
        }),
        cookie: {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days in ms
        },
    })
)

// ── OAuth endpoints ───────────────────────────────────────────────────────────
app.use('/authorize', authorizeRouter)
app.use('/token', tokenRouter)
app.use('/register', registerRouter)
app.use('/logout', logoutRouter)
app.use('/.well-known', jwksRouter)

// ── Identity / account API ───────────────────────────────────────────────────
app.use('/api/v1/user', identityRouter)

// ── Developer portal API ─────────────────────────────────────────────────────
app.use('/developer', developerRouter)

app.use(errorHandler)

export default app
