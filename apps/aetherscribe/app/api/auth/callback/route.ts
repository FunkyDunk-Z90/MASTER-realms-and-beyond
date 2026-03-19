import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── GET /api/auth/callback ────────────────────────────────────────────────────
// OAuth 2.0 + PKCE callback handler.
// The auth server redirects here after the user authenticates. This route:
//   1. Validates the CSRF state token.
//   2. Exchanges the authorization code + code_verifier for tokens (server-to-server).
//   3. Sets the auth_token httpOnly cookie.
//   4. Redirects to the original destination (stored in oauth_return_to cookie).
//
// Required env vars:
//   RNB_AUTH_SERVER_URL, RNB_CLIENT_ID, RNB_CLIENT_SECRET, RNB_REDIRECT_URI

export async function GET(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = request.nextUrl
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    const storedState = request.cookies.get('oauth_state')?.value
    const codeVerifier = request.cookies.get('oauth_code_verifier')?.value
    const returnTo = request.cookies.get('oauth_return_to')?.value ?? '/hub'

    // ── CSRF check ─────────────────────────────────────────────────────────────
    if (!state || !storedState || state !== storedState) {
        console.error('[SSO] State mismatch on callback')
        return new NextResponse('State mismatch. Possible CSRF attack.', { status: 403 })
    }

    if (!code) {
        return new NextResponse('No authorization code received.', { status: 400 })
    }

    if (!codeVerifier) {
        console.error('[SSO] Missing code_verifier cookie')
        return new NextResponse('Missing PKCE verifier. Please try again.', { status: 400 })
    }

    // ── Server-to-server token exchange ────────────────────────────────────────
    const authServerUrl = process.env.RNB_AUTH_SERVER_URL ?? 'http://localhost:2611'

    let accessToken: string

    try {
        const tokenRes = await fetch(`${authServerUrl}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                code_verifier: codeVerifier,
                client_id: process.env.RNB_CLIENT_ID,
                client_secret: process.env.RNB_CLIENT_SECRET,
                redirect_uri: process.env.RNB_REDIRECT_URI,
            }),
        })

        if (!tokenRes.ok) {
            const err = await tokenRes.json() as { error: string }
            console.error('[SSO] Token exchange failed:', err)

            if (err.error === 'invalid_grant') {
                // Code expired, used, or PKCE mismatch — restart the flow
                return NextResponse.redirect(new URL('/api/auth/initiate', request.url))
            }
            if (err.error === 'invalid_client') {
                console.error('[SSO] CRITICAL: invalid client credentials — check RNB_CLIENT_ID/SECRET')
                return new NextResponse('Configuration error.', { status: 500 })
            }
            return new NextResponse('Authentication failed. Please try again.', { status: 400 })
        }

        const data = await tokenRes.json() as { access_token: string }
        accessToken = data.access_token
    } catch (err) {
        console.error('[SSO] Token exchange request error:', err)
        return new NextResponse('An error occurred during authentication.', { status: 500 })
    }

    // ── Set auth cookie and redirect ────────────────────────────────────────────
    const isDev = process.env.NODE_ENV !== 'production'
    const res = NextResponse.redirect(new URL(returnTo, request.url))

    res.cookies.set('auth_token', accessToken, {
        httpOnly: true,
        secure: !isDev,
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    // Clear temporary OAuth cookies
    res.cookies.delete('oauth_state')
    res.cookies.delete('oauth_code_verifier')
    res.cookies.delete('oauth_return_to')

    return res
}
