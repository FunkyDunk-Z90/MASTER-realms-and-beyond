import nodemailer from 'nodemailer'
import { env } from '../config/validateEnv'

const transporter = nodemailer.createTransport({
    host: env.MAILTRAP_HOST,
    port: env.MAILTRAP_PORT,
    secure: false,
    auth: {
        user: env.MAILTRAP_USERNAME,
        pass: env.MAILTRAP_PASSWORD,
    },
})

export { transporter }
