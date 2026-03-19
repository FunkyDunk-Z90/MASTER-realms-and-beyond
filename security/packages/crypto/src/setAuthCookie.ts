import { Response } from 'express'
import { createToken } from './createToken'

export const AUTH_COOKIE_NAME = 'auth_token'

export const setAuthCookie = (
    res: Response,
    identityId: string,
    jwtSecret: string,
    isDev?: boolean
): void => {
    const token = createToken(identityId, jwtSecret)

    res.cookie(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: !isDev,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
}
