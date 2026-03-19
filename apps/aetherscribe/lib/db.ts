import mongoose from 'mongoose'

// Standard Next.js MongoDB connection cache — reuses the connection across
// hot-reloads in dev and across invocations in production serverless functions.

interface MongoCache {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
}

declare global {
    // eslint-disable-next-line no-var
    var _mongoCache: MongoCache | undefined
}

const cached: MongoCache = global._mongoCache ?? { conn: null, promise: null }
global._mongoCache = cached

export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) return cached.conn

    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI is not defined in environment variables.')

    if (!cached.promise) {
        cached.promise = mongoose.connect(uri)
    }

    cached.conn = await cached.promise
    return cached.conn
}
