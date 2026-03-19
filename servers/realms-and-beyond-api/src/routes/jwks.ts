import { Router, type Request, type Response } from 'express'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const router = Router()

const ISSUER = 'https://auth.realmsandbeyond.com'

// Load and parse the public key once at startup
let JWKS: object
try {
    const publicKeyPem = fs.readFileSync(
        path.join(process.cwd(), 'keys', 'public.pem'),
        'utf8'
    )
    const publicKey = crypto.createPublicKey(publicKeyPem)
    const jwk = publicKey.export({ format: 'jwk' }) as { n: string; e: string }

    JWKS = {
        keys: [
            {
                kty: 'RSA',
                use: 'sig',
                alg: 'RS256',
                kid: process.env['JWT_KEY_ID'] ?? '',
                n: jwk.n,
                e: jwk.e,
            },
        ],
    }
} catch {
    console.warn('[auth] Public key not found at keys/public.pem — JWKS endpoint will return empty set.')
    JWKS = { keys: [] }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /.well-known/jwks.json
// Public key set — clients use this to verify RS256 JWTs.
// Cached for 1 hour; re-fetch on unknown kid for key rotation.
// ─────────────────────────────────────────────────────────────────────────────

router.get('/jwks.json', (_req: Request, res: Response): void => {
    res.set('Cache-Control', 'public, max-age=3600')
    res.json(JWKS)
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /.well-known/openid-configuration
// OIDC discovery document — lets clients auto-configure without hardcoding URLs.
// ─────────────────────────────────────────────────────────────────────────────

router.get('/openid-configuration', (_req: Request, res: Response): void => {
    res.json({
        issuer: ISSUER,
        authorization_endpoint: `${ISSUER}/authorize`,
        token_endpoint: `${ISSUER}/token`,
        token_refresh_endpoint: `${ISSUER}/token/refresh`,
        registration_endpoint: `${ISSUER}/register`,
        end_session_endpoint: `${ISSUER}/logout`,
        jwks_uri: `${ISSUER}/.well-known/jwks.json`,
        response_types_supported: ['code'],
        grant_types_supported: ['authorization_code', 'refresh_token'],
        token_endpoint_auth_methods_supported: ['client_secret_post', 'none'],
        code_challenge_methods_supported: ['S256'],
        scopes_supported: ['profile', 'email', 'openid'],
    })
})

export default router
