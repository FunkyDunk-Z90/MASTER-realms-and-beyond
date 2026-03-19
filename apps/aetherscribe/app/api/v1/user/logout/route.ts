import { NextResponse } from 'next/server'

// ─── POST /api/v1/user/logout ─────────────────────────────────────────────────
// Clears the local auth_token cookie and destroys the global R&B SSO session.

export async function POST(request: Request): Promise<NextResponse> {
    const authServerUrl = process.env.RNB_AUTH_SERVER_URL ?? 'http://localhost:2611'

    // Best-effort — destroy the SSO session on the auth server
    try {
        await fetch(`${authServerUrl}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                cookie: request.headers.get('cookie') ?? '',
            },
            body: JSON.stringify({}),
        })
    } catch {
        // Non-fatal — proceed with local logout regardless
    }

    const res = NextResponse.json({ ok: true })
    res.cookies.delete('auth_token')
    return res
}
