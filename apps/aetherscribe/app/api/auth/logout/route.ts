import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── POST /api/auth/logout ─────────────────────────────────────────────────────
// Logs the user out of:
//   1. This app — clears the auth_token httpOnly cookie.
//   2. The IAM server — calls POST /api/v1/user/logout (clears IAM-side session).
//   3. The SSO system — calls POST /auth/logout (destroys the SSO session so the
//      user must re-authenticate on all apps, not just this one).
//
// Redirects to the landing page after cleanup.

export async function POST(request: NextRequest): Promise<NextResponse> {
    const authServerUrl = process.env.RNB_AUTH_SERVER_URL ?? 'http://localhost:2611'
    const cookieHeader = request.headers.get('cookie') ?? ''

    await Promise.allSettled([
        // Destroy the JWT session on the IAM server (clears server-side tracking)
        fetch(`${authServerUrl}/api/v1/user/logout`, {
            method: 'POST',
            headers: { Cookie: cookieHeader },
        }),
        // Destroy the SSO session on the auth server
        fetch(`${authServerUrl}/auth/logout`, {
            method: 'POST',
            headers: { Cookie: cookieHeader, 'Content-Type': 'application/json' },
        }),
    ])

    const res = NextResponse.redirect(new URL('/', request.url))
    res.cookies.delete('auth_token')
    return res
}
