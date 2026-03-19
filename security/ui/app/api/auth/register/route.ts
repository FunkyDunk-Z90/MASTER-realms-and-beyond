import { NextRequest, NextResponse } from 'next/server'

const AUTH_API = process.env.NEXT_PUBLIC_AUTH_SERVER_URL ?? 'http://localhost:2611'

// POST /api/auth/register
// Used by the account portal direct registration (no OAuth params).

export async function POST(req: NextRequest) {
    const formData = await req.formData()
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const passwordConfirm = formData.get('passwordConfirm') as string

    const apiRes = await fetch(`${AUTH_API}/api/v1/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, passwordConfirm }),
    })

    if (!apiRes.ok) {
        const err = await apiRes.json().catch(() => ({})) as { field?: string }
        const errorParam = err.field === 'email' ? 'email_taken' : 'register_failed'
        return NextResponse.redirect(new URL(`/register?error=${errorParam}`, req.url))
    }

    const res = NextResponse.redirect(new URL('/account', req.url))
    const setCookie = apiRes.headers.get('set-cookie')
    if (setCookie) {
        res.headers.set('set-cookie', setCookie)
    }

    return res
}
