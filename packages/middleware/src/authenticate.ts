import { Request, Response, NextFunction } from 'express'
import { HydratedDocument, Types } from 'mongoose'
import { Identity } from '@rnb/database'
import { AppError } from '@rnb/errors'
import { extractToken, verifyToken } from '@rnb/security'
import { env, T_Identity } from '@rnb/validators'
import { T_IdentityMethods } from '@rnb/database'

// ─── Request Augmentation ─────────────────────────────────────────────────────
// Attach the hydrated identity to req so downstream controllers have full
// access to all instance methods (toClient, verifyPassword, etc.)
// We intersect with { _id: Types.ObjectId } because T_Identity is a Zod-inferred
// type that has no _id field, causing Mongoose to default it to unknown.

declare global {
    namespace Express {
        interface Request {
            identity?: HydratedDocument<T_Identity, T_IdentityMethods> & { _id: Types.ObjectId }
        }
    }
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

        const payload = verifyToken(token, env.JWT_SECRET)

        if (!payload?.sub) {
            throw new AppError('Invalid token.', 401)
        }

        const identity = await Identity.findById(payload.sub)

        if (!identity) {
            throw new AppError(
                'The account belonging to this token no longer exists.',
                401
            )
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
