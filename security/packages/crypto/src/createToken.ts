import jwt from 'jsonwebtoken'

const JWT_EXPIRY = '7d'

export const createToken = (identityId: string, jwtSecret: string): string =>
    jwt.sign({ sub: identityId }, jwtSecret, { expiresIn: JWT_EXPIRY })
