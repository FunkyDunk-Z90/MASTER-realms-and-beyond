import 'dotenv/config'
import { connect } from 'mongoose'
import { env } from './config/validateEnv'
import app from './app'

const mongoUri = env.DATABASE.replace('<PASSWORD>', env.DATABASE_PASSWORD)

const connectToDatabase = async function () {
    try {
        await connect(mongoUri)
        console.log('Connected to Database')
    } catch (error) {
        console.error(error)
        console.log("Couldn't connect to database")
    }
}

const startServer = async function () {
    try {
        await connectToDatabase()

        app.listen(env.PORT, () => {
            console.log(`Auth server running on port ${env.PORT}`)
        })
    } catch (error) {
        console.error(error)
        console.log("Couldn't start server")
    }
}

startServer()
