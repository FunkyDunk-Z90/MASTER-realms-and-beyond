import crypto from 'crypto'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── GET /api/auth/initiate ────────────────────────────────────────────────────
// Starts the OAuth 2.0 + PKCE Authorization Code Flow.
// 1. Generates CSRF state + PKCE code_verifier/code_challenge.
// 2. Stores state, verifier, and return destination in short-lived httpOnly cookies.
// 3. Redirects the browser to GET /authorize on the R&B auth server.
//
// Required env vars (server-side only):
//   RNB_AUTH_SERVER_URL  e.g. http://localhost:2611
//   RNB_CLIENT_ID        your app's client_id
//   RNB_REDIRECT_URI     e.g. http://localhost:3000/api/auth/callback

export async function GET(request: NextRequest): Promise<NextResponse> {
    const returnTo = request.nextUrl.searchParams.get('returnTo') ?? '/hub'

    const authServerUrl = process.env.RNB_AUTH_SERVER_URL ?? 'http://localhost:2611'
    const clientId = process.env.RNB_CLIENT_ID
    const redirectUri = process.env.RNB_REDIRECT_URI

    if (!clientId || !redirectUri) {
        console.error('[SSO] Missing RNB_CLIENT_ID or RNB_REDIRECT_URI env vars')
        return new NextResponse('Server configuration error.', { status: 500 })
    }

    // ── PKCE ────────────────────────────────────────────────────────────────────
    const code_verifier = crypto.randomBytes(64).toString('base64url')
    const code_challenge = crypto
        .createHash('sha256')
        .update(code_verifier)
        .digest('base64url')

    const state = crypto.randomBytes(16).toString('hex')

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        state,
        code_challenge,
        code_challenge_method: 'S256',
        scope: 'profile email',
    })

    const authUrl = `${authServerUrl}/authorize?${params.toString()}`
    const res = NextResponse.redirect(authUrl)

    const cookieOpts = {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 300, // 5 minutes — must survive the redirect round-trip
    }

    res.cookies.set('oauth_state', state, cookieOpts)
    res.cookies.set('oauth_code_verifier', code_verifier, cookieOpts)
    res.cookies.set('oauth_return_to', returnTo, cookieOpts)

    return res
}
