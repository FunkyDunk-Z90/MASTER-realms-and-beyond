import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import jwksClient, { type JwksClient } from 'jwks-rsa'
import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'

// ─── Session Augmentation ─────────────────────────────────────────────────────

declare module 'express-session' {
    interface SessionData {
        user?: {
            id: string
            email: string
            displayName: string
            roles: string[]
            scopes: string[]
        }
        refreshToken?: string   // opaque refresh token from auth server
        oauthState?: string    // CSRF state, cleared after callback
        codeVerifier?: string  // PKCE verifier, cleared after token exchange
        returnTo?: string      // original URL to redirect to after auth
    }
}

// ─── Config ───────────────────────────────────────────────────────────────────

export interface SSOConfig {
    /** Base URL of the R&B auth server, e.g. http://localhost:2611 */
    authServerUrl: string
    /** This app's registered client_id */
    clientId: string
    /** This app's registered client_secret (confidential clients only, never in browser) */
    clientSecret: string
    /** This app's registered redirect_uri (must match exactly) */
    redirectUri: string
    /** Space-separated scopes to request (default: 'profile email') */
    scope?: string
    /** JWT issuer to verify — defaults to 'https://auth.realmsandbeyond.com' */
    issuer?: string
}

// ─── Internal Zod schemas ─────────────────────────────────────────────────────

const CallbackQuerySchema = z.object({
    code: z.string().min(1),
    state: z.string().min(1),
})

const TokenResponseSchema = z.object({
    access_token: z.string().min(1),
    token_type: z.literal('Bearer'),
    expires_in: z.number().int().positive(),
    refresh_token: z.string().min(1),
    scope: z.string(),
})

const JwtPayloadSchema = z.object({
    sub: z.string().min(1),
    email: z.email(),
    displayName: z.string(),
    roles: z.array(z.string()),
    scopes: z.array(z.string()),
    iss: z.string(),
    aud: z.string(),
    exp: z.number().int(),
    iat: z.number().int(),
})

const ErrorResponseSchema = z.object({
    error: z.string(),
    error_description: z.string().optional(),
})

// ─── createRequireSSOAuth ────────────────────────────────────────────────────
// Drop-in middleware for Express routes that require R&B SSO authentication.
//
// If the app-level session already has a user, the request proceeds.
// Otherwise: generates PKCE verifier + challenge + state, saves to session,
// then redirects to the auth server's /authorize endpoint.
//
// Usage:
//   const requireAuth = createRequireSSOAuth({ authServerUrl, clientId, ... })
//   router.get('/dashboard', requireAuth, handler)

export function createRequireSSOAuth(config: SSOConfig) {
    return async function requireSSOAuth(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        if (req.session.user) {
            next()
            return
        }

        req.session.returnTo = req.originalUrl

        // PKCE — code_verifier stays server-side, code_challenge goes to auth server
        const codeVerifier = crypto.randomBytes(64).toString('base64url')
        const codeChallenge = crypto
            .createHash('sha256')
            .update(codeVerifier)
            .digest('base64url')

        const state = crypto.randomBytes(16).toString('hex')

        req.session.oauthState = state
        req.session.codeVerifier = codeVerifier

        await new Promise<void>((resolve, reject) =>
            req.session.save((err) => (err ? reject(err) : resolve()))
        )

        const params = new URLSearchParams({
            client_id: config.clientId,
            redirect_uri: config.redirectUri,
            state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            scope: config.scope ?? 'profile email',
        })

        res.redirect(`${config.authServerUrl}/authorize?${params.toString()}`)
    }
}

// ─── createSSOCallbackHandler ────────────────────────────────────────────────
// Express route handler for the OAuth callback URL.
// Mount at the path registered as this app's redirect_uri.
//
// Flow:
//   1. Verify state param matches session (CSRF check)
//   2. Exchange code + code_verifier for tokens (server-to-server)
//   3. Verify the RS256 JWT via auth server's JWKS endpoint
//   4. Store verified user in session, redirect to original URL
//
// Usage:
//   const ssoCallback = createSSOCallbackHandler({ authServerUrl, clientId, ... })
//   router.get('/auth/callback', ssoCallback)

export function createSSOCallbackHandler(config: SSOConfig) {
    const issuer = config.issuer ?? 'https://auth.realmsandbeyond.com'

    // JWKS client — caches public keys, refetches on unknown kid (handles rotation)
    const jwks: JwksClient = jwksClient({
        jwksUri: `${config.authServerUrl}/.well-known/jwks.json`,
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 60 * 60 * 1000, // 1 hour
    })

    async function verifyAccessToken(token: string) {
        const decoded = await new Promise<unknown>((resolve, reject) => {
            jwt.verify(
                token,
                (header, callback) => {
                    jwks.getSigningKey(header.kid, (err, key) => {
                        if (err || !key) return callback(err ?? new Error('No signing key'))
                        callback(null, key.getPublicKey())
                    })
                },
                {
                    algorithms: ['RS256'],
                    issuer,
                    audience: config.clientId,
                },
                (err, payload) => (err ? reject(err) : resolve(payload))
            )
        })

        const payload = JwtPayloadSchema.parse(decoded)
        return {
            id: payload.sub,
            email: payload.email,
            displayName: payload.displayName,
            roles: payload.roles,
            scopes: payload.scopes,
        }
    }

    return async function handleSSOCallback(
        req: Request,
        res: Response
    ): Promise<void> {
        const queryResult = CallbackQuerySchema.safeParse(req.query)
        if (!queryResult.success) {
            res.status(400).send('Invalid callback parameters.')
            return
        }

        const { code, state } = queryResult.data

        // ── CSRF check ────────────────────────────────────────────────────────
        if (state !== req.session.oauthState) {
            res.status(403).send('State mismatch. Possible CSRF attack.')
            return
        }

        const codeVerifier = req.session.codeVerifier
        if (!codeVerifier) {
            res.status(400).send('Missing code verifier.')
            return
        }

        try {
            // ── Server-to-server token exchange ───────────────────────────────
            const tokenResponse = await fetch(`${config.authServerUrl}/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    code_verifier: codeVerifier,
                    client_id: config.clientId,
                    client_secret: config.clientSecret,
                    redirect_uri: config.redirectUri,
                }),
            })

            if (!tokenResponse.ok) {
                const errData = ErrorResponseSchema.parse(await tokenResponse.json())
                console.error('[SSO] Token exchange failed:', errData)

                if (errData.error === 'invalid_grant') {
                    // Code expired or verifier mismatch — restart auth flow
                    res.redirect('/auth/initiate')
                    return
                }
                if (errData.error === 'invalid_client') {
                    console.error('[SSO] CRITICAL: invalid client credentials — check RNB_CLIENT_ID and RNB_CLIENT_SECRET')
                    res.status(500).send('Configuration error.')
                    return
                }
                res.status(400).send('Authentication failed. Please try again.')
                return
            }

            const tokens = TokenResponseSchema.parse(await tokenResponse.json())

            // ── Verify the RS256 JWT via JWKS ─────────────────────────────────
            const sessionUser = await verifyAccessToken(tokens.access_token)

            req.session.user = sessionUser
            req.session.refreshToken = tokens.refresh_token
            req.session.oauthState = undefined
            req.session.codeVerifier = undefined

            const returnTo = req.session.returnTo ?? '/'
            req.session.returnTo = undefined

            await new Promise<void>((resolve, reject) =>
                req.session.save((err) => (err ? reject(err) : resolve()))
            )

            res.redirect(returnTo)
        } catch (err) {
            console.error('[SSO] Auth callback error:', err)
            res.status(500).send('Authentication failed.')
        }
    }
}
