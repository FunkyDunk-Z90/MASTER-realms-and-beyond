import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { errorHandler } from '@rnb/middleware'
import aetherscribeRouter from './routes/aetherscribeRouter'

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

app.use('/api/v1/account', aetherscribeRouter)

app.use(errorHandler)

export default app
