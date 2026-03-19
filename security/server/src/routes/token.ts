import { Router, type Request, type Response } from 'express'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { validate } from '../middleware/validate'
import {
    TokenBodySchema,
    RefreshTokenBodySchema,
    type TokenBody,
    type RefreshTokenBody,
} from '../schemas/auth'
import { Identity, App, AuthCode, RefreshToken } from '@rnb/database'
import { env } from '../config/validateEnv'

const router = Router()

const JWT_ISSUER = 'https://auth.realmsandbeyond.com'

// Load RS256 private key once at startup
let privateKey: Buffer
try {
    privateKey = fs.readFileSync(path.join(process.cwd(), 'keys', 'private.pem'))
} catch {
    console.warn(
        '[auth] RS256 private key not found at keys/private.pem. ' +
        'Run scripts/generateKeys.sh before starting the server.'
    )
    privateKey = Buffer.from('')
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /token
// Server-to-server code → access + refresh token exchange.
// Browser never calls this endpoint.
//
//   - Validates client (+ client_secret for confidential clients)
//   - Verifies PKCE: SHA256(code_verifier) must equal stored code_challenge
//   - Deletes the auth code (single use)
//   - Issues RS256 JWT + refresh token
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/',
    validate(TokenBodySchema, 'body'),
    async (req: Request, res: Response): Promise<void> => {
        const body = res.locals.validated.body as TokenBody

        const client = await App.findOne({ clientId: body.client_id, active: true })
        if (!client) {
            res.status(401).json({ error: 'invalid_client' })
            return
        }

        // Confidential clients must provide a matching client_secret
        if (client.clientType === 'confidential') {
            if (!body.client_secret || body.client_secret !== client.clientSecret) {
                res.status(401).json({
                    error: 'invalid_client',
                    error_description: 'Invalid client_secret.',
                })
                return
            }
        }

        const authCode = await AuthCode.findOne({
            code: body.code,
            clientId: body.client_id,
            redirectUri: body.redirect_uri,
        })

        if (!authCode) {
            res.status(400).json({ error: 'invalid_grant', error_description: 'Code not found.' })
            return
        }

        if (authCode.expiresAt < new Date()) {
            await AuthCode.deleteOne({ _id: authCode._id })
            res.status(400).json({ error: 'invalid_grant', error_description: 'Code expired.' })
            return
        }

        // ── PKCE verification ─────────────────────────────────────────────────
        const verifierHash = crypto
            .createHash('sha256')
            .update(body.code_verifier)
            .digest('base64url')

        if (verifierHash !== authCode.codeChallenge) {
            res.status(400).json({
                error: 'invalid_grant',
                error_description: 'code_verifier mismatch.',
            })
            return
        }

        // Single use — delete immediately after verification
        await AuthCode.deleteOne({ _id: authCode._id })

        const identity = await Identity.findById(authCode.userId)
        if (!identity) {
            res.status(400).json({ error: 'invalid_grant', error_description: 'User not found.' })
            return
        }

        const displayName = `${identity.profile.firstName} ${identity.profile.lastName}`.trim()

        const accessToken = jwt.sign(
            {
                sub: identity._id.toString(),
                email: identity.profile.email,
                displayName,
                roles: ['user'],
                scopes: authCode.scopes,
                iss: JWT_ISSUER,
                aud: body.client_id,
            },
            privateKey,
            { algorithm: 'RS256', expiresIn: '1h', keyid: env.JWT_KEY_ID }
        )

        const refreshTokenValue = crypto.randomBytes(64).toString('hex')
        await RefreshToken.create({
            token: refreshTokenValue,
            userId: identity._id,
            clientId: body.client_id,
            scopes: authCode.scopes,
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        })

        res.json({
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: refreshTokenValue,
            scope: authCode.scopes.join(' '),
        })
    }
)

// ─────────────────────────────────────────────────────────────────────────────
// POST /token/refresh
// Rotate refresh token and issue a new access token.
// Replay detection: if a token is reused after rotation, all tokens for that
// user+client are revoked immediately.
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/refresh',
    validate(RefreshTokenBodySchema, 'body'),
    async (req: Request, res: Response): Promise<void> => {
        const body = res.locals.validated.body as RefreshTokenBody

        const storedToken = await RefreshToken.findOne({
            token: body.refresh_token,
            clientId: body.client_id,
        })

        if (!storedToken) {
            res.status(401).json({
                error: 'invalid_grant',
                error_description: 'Refresh token not found.',
            })
            return
        }

        if (storedToken.expiresAt < new Date()) {
            await RefreshToken.deleteOne({ _id: storedToken._id })
            res.status(401).json({
                error: 'invalid_grant',
                error_description: 'Refresh token expired.',
            })
            return
        }

        // Replay detection — token already rotated means it was stolen
        if (storedToken.rotatedAt !== null) {
            console.warn(
                `[auth] Refresh token reuse detected: userId=${storedToken.userId.toString()} clientId=${body.client_id}`
            )
            await RefreshToken.deleteMany({
                userId: storedToken.userId,
                clientId: body.client_id,
            })
            res.status(401).json({
                error: 'invalid_grant',
                error_description: 'Refresh token already used.',
            })
            return
        }

        const identity = await Identity.findById(storedToken.userId)
        if (!identity) {
            res.status(400).json({ error: 'invalid_grant' })
            return
        }

        const displayName = `${identity.profile.firstName} ${identity.profile.lastName}`.trim()

        const accessToken = jwt.sign(
            {
                sub: identity._id.toString(),
                email: identity.profile.email,
                displayName,
                roles: ['user'],
                scopes: storedToken.scopes,
                iss: JWT_ISSUER,
                aud: body.client_id,
            },
            privateKey,
            { algorithm: 'RS256', expiresIn: '1h', keyid: env.JWT_KEY_ID }
        )

        const newRefreshTokenValue = crypto.randomBytes(64).toString('hex')
        await RefreshToken.create({
            token: newRefreshTokenValue,
            userId: identity._id,
            clientId: body.client_id,
            scopes: storedToken.scopes,
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        })

        // Mark old token as rotated (invalidated)
        await RefreshToken.updateOne(
            { _id: storedToken._id },
            { rotatedAt: new Date(), replacedBy: newRefreshTokenValue }
        )

        res.json({
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: newRefreshTokenValue,
            scope: storedToken.scopes.join(' '),
        })
    }
)

export default router
