import { Request } from 'express'

export const extractToken = (req: Request): string | undefined => {
    const cookieToken = req.cookies?.jwt
    const { authorization } = req.headers

    if (cookieToken) return cookieToken

    if (authorization?.startsWith('Bearer')) {
        return authorization.split(' ')[1]
    }

    return undefined
}
