import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { errorHandler } from '@rnb/middleware'
import { authenticate } from '@rnb/middleware'
import aetherscribeRouter from './routes/aetherscribeRouter'
import codexRouter from './routes/codexRouter'
import {
    worldRouter,
    campaignRouter,
    characterRouter,
    npcRouter,
    bestiaryRouter,
    ancestryRouter,
    loreRouter,
    itemRouter,
    arcanaRouter,
    locationRouter,
    nationRouter,
    factionRouter,
} from './routes/contentRouters'

const app = express()

app.use(morgan('dev'))

app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
)

app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

// ─── Account Management ───────────────────────────────────────────────────────
app.use('/api/v1/account', aetherscribeRouter)

// ─── Protected Content Routes ─────────────────────────────────────────────────
app.use('/api/v1/codex', authenticate, codexRouter)
app.use('/api/v1/worlds', authenticate, worldRouter)
app.use('/api/v1/campaigns', authenticate, campaignRouter)
app.use('/api/v1/characters', authenticate, characterRouter)
app.use('/api/v1/npcs', authenticate, npcRouter)
app.use('/api/v1/bestiary', authenticate, bestiaryRouter)
app.use('/api/v1/ancestries', authenticate, ancestryRouter)
app.use('/api/v1/lore', authenticate, loreRouter)
app.use('/api/v1/items', authenticate, itemRouter)
app.use('/api/v1/arcana', authenticate, arcanaRouter)
app.use('/api/v1/locations', authenticate, locationRouter)
app.use('/api/v1/nations', authenticate, nationRouter)
app.use('/api/v1/factions', authenticate, factionRouter)

app.use(errorHandler)

export default app
