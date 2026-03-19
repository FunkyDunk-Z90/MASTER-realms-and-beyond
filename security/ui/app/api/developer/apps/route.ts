import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const AUTH_SERVER_URL = process.env.RNB_AUTH_SERVER_URL ?? 'http://localhost:2611'

// POST /api/developer/apps
// Proxies to the auth server's /developer/apps endpoint.
// Reads and forwards the auth_token cookie.

export async function POST(req: NextRequest) {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')?.value

    if (!authToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const apiRes = await fetch(`${AUTH_SERVER_URL}/developer/apps`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `auth_token=${authToken}`,
        },
        body: JSON.stringify(body),
    })

    const data = await apiRes.json()

    if (!apiRes.ok) {
        return NextResponse.json(data, { status: apiRes.status })
    }

    return NextResponse.json(data, { status: 201 })
}

// GET /api/developer/apps
// Lists ventures for the authenticated user.

export async function GET(_req: NextRequest) {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')?.value

    if (!authToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const apiRes = await fetch(`${AUTH_SERVER_URL}/developer/apps`, {
        headers: {
            Cookie: `auth_token=${authToken}`,
        },
        cache: 'no-store',
    })

    const data = await apiRes.json()

    if (!apiRes.ok) {
        return NextResponse.json(data, { status: apiRes.status })
    }

    return NextResponse.json(data)
}
