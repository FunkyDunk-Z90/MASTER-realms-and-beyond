import { Response } from 'express'
import { AUTH_COOKIE_NAME } from './setAuthCookie'

// Clears the auth cookie. isDev must match the flag used when setting it
// so the browser treats it as the same cookie (secure flag must match).

export const clearCookie = (res: Response, isDev?: boolean): void => {
    res.clearCookie(AUTH_COOKIE_NAME, {
        httpOnly: true,
        sameSite: 'strict',
        secure: !isDev,
    })
}
