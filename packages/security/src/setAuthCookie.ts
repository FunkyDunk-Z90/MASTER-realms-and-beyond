import { Response } from 'express'
import jwt from 'jsonwebtoken'

const JWT_EXPIRY = '7d'
const COOKIE_NAME = 'auth_token'

export const setAuthCookie = (
    res: Response,
    identityId: string,
    jwtSecret: string,
    isDev?: boolean
): void => {
    const token = jwt.sign({ sub: identityId }, jwtSecret, {
        expiresIn: JWT_EXPIRY,
    })

    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: !isDev,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
}
