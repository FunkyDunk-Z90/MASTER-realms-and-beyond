import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_SERVER_URL ?? 'http://localhost:2611'

// POST /api/auth/logout
// Destroys both the identity JWT cookie and the R&B SSO session.

export async function POST(req: NextRequest) {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')?.value

    // Destroy the JWT cookie (identity API logout)
    if (authToken) {
        await fetch(`${AUTH_API}/api/v1/user/logout`, {
            method: 'POST',
            headers: {
                Cookie: `auth_token=${authToken}`,
            },
        }).catch(() => { /* best effort */ })
    }

    // Destroy the R&B SSO session (global logout)
    await fetch(`${AUTH_API}/auth/logout`, {
        method: 'POST',
    }).catch(() => { /* best effort */ })

    const res = NextResponse.redirect(new URL('/login', req.url))
    // Clear the auth_token cookie on the browser
    res.cookies.set('auth_token', '', { maxAge: 0 })

    return res
}
