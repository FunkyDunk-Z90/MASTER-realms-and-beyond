import jwt from 'jsonwebtoken'

export interface I_TokenPayload {
    sub: string
    iat: number
    exp: number
}

export const verifyToken = (token: string, secret: string): I_TokenPayload =>
    jwt.verify(token, secret) as I_TokenPayload
