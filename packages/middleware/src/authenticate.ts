import { Request, Response, NextFunction } from 'express'
import { HydratedDocument, Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { Identity } from '@rnb/database'
import { AppError } from '@rnb/errors'
import { extractToken } from '@rnb/security'
import { T_Identity } from '@rnb/validators'
import { T_IdentityMethods } from '@rnb/database'

// ─── Request Augmentation ─────────────────────────────────────────────────────

declare global {
    namespace Express {
        interface Request {
            identity?: HydratedDocument<T_Identity, T_IdentityMethods> & { _id: Types.ObjectId }
        }
    }
}

// ─── JWKS Client ──────────────────────────────────────────────────────────────
// Fetches the auth server's public key set and caches it for 1 hour.
// Re-fetches automatically when a JWT contains an unknown kid (key rotation).

const jwks = jwksClient({
    jwksUri: `${process.env.RNB_AUTH_SERVER_URL ?? 'http://localhost:2611'}/.well-known/jwks.json`,
    cache: true,
    cacheMaxAge: 60 * 60 * 1000,
})

function getSigningKey(kid: string | undefined): Promise<string> {
    return new Promise((resolve, reject) => {
        jwks.getSigningKey(kid, (err, key) => {
            if (err || !key) reject(err ?? new Error('No signing key found'))
            else resolve(key.getPublicKey())
        })
    })
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = extractToken(req)

        if (!token) {
            throw new AppError('You are not logged in.', 401)
        }

        // Decode header to get kid before verification
        const decoded = jwt.decode(token, { complete: true })
        const signingKey = await getSigningKey(decoded?.header.kid)

        const payload = jwt.verify(token, signingKey, {
            algorithms: ['RS256'],
            issuer: 'https://auth.realmsandbeyond.com',
        }) as { sub?: string }

        if (!payload?.sub) {
            throw new AppError('Invalid token.', 401)
        }

        const identity = await Identity.findById(payload.sub)

        if (!identity) {
            throw new AppError('The account belonging to this token no longer exists.', 401)
        }

        if (!identity.isActive()) {
            throw new AppError('Your account has been suspended.', 403)
        }

        req.identity = identity
        next()
    } catch (err) {
        next(err)
    }
}
