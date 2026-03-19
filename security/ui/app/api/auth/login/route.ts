import { NextRequest, NextResponse } from 'next/server'

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_SERVER_URL ?? 'http://localhost:2611'

// POST /api/auth/login
// Used by the account portal direct login (no OAuth params).
// Proxies to the identity API, which sets the auth_token cookie.

export async function POST(req: NextRequest) {
    const formData = await req.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return NextResponse.redirect(new URL('/login?error=missing_credentials', req.url))
    }

    const apiRes = await fetch(`${AUTH_API}/api/v1/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })

    if (!apiRes.ok) {
        return NextResponse.redirect(new URL('/login?error=invalid_credentials', req.url))
    }

    // Forward the Set-Cookie header from the auth server to the browser,
    // then redirect to the account portal.
    const res = NextResponse.redirect(new URL('/account', req.url))
    const setCookie = apiRes.headers.get('set-cookie')
    if (setCookie) {
        res.headers.set('set-cookie', setCookie)
    }

    return res
}
