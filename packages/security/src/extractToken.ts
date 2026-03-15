import { Request } from 'express'
import { AUTH_COOKIE_NAME } from './setAuthCookie'

export const extractToken = (req: Request): string | undefined => {
    const cookieToken = req.cookies?.[AUTH_COOKIE_NAME]
    const { authorization } = req.headers

    if (cookieToken) return cookieToken

    if (authorization?.startsWith('Bearer ')) {
        return authorization.split(' ')[1]
    }

    return undefined
}
