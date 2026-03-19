import { createVerify, createPublicKey } from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// ─── GET /api/v1/user/me ───────────────────────────────────────────────────────
// Verifies the RS256 auth_token cookie, then calls the Aetherscribe Express API
// to check whether the user has an Aetherscribe profile.
// No direct database access — all data comes from backend servers.

function base64urlDecode(str: string): string {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const padding = '='.repeat((4 - (base64.length % 4)) % 4)
    return Buffer.from(base64 + padding, 'base64').toString('utf8')
}

interface JwkKey {
    kty: string
    kid?: string
    n: string
    e: string
}

interface JwtPayload {
    sub: string
    email: string
    displayName: string
    roles: string[]
    scopes: string[]
    exp: number
}

async function verifyRS256(token: string): Promise<JwtPayload> {
    const parts = token.split('.')
    if (parts.length !== 3) throw new Error('Invalid JWT format')

    const [headerB64, payloadB64, signatureB64] = parts as [string, string, string]
    const header = JSON.parse(base64urlDecode(headerB64)) as { kid?: string; alg: string }

    if (header.alg !== 'RS256') throw new Error('Unexpected JWT algorithm')

    const authServerUrl = process.env.RNB_AUTH_SERVER_URL ?? 'http://localhost:2611'
    const jwksRes = await fetch(`${authServerUrl}/.well-known/jwks.json`, {
        next: { revalidate: 3600 },
    })

    if (!jwksRes.ok) throw new Error('Failed to fetch JWKS')

    const { keys } = (await jwksRes.json()) as { keys: JwkKey[] }
    const jwk = keys.find((k) => !header.kid || k.kid === header.kid)
    if (!jwk) throw new Error('No matching signing key in JWKS')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const publicKey = createPublicKey({ key: jwk as any, format: 'jwk' })

    const verifier = createVerify('RSA-SHA256')
    verifier.update(`${headerB64}.${payloadB64}`)
    const valid = verifier.verify(publicKey, Buffer.from(signatureB64, 'base64url'))
    if (!valid) throw new Error('Invalid JWT signature')

    const payload = JSON.parse(base64urlDecode(payloadB64)) as JwtPayload
    if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error('JWT expired')

    return payload
}

export async function GET(): Promise<NextResponse> {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
        return NextResponse.json({ message: 'Unauthorised' }, { status: 401 })
    }

    try {
        const payload = await verifyRS256(token)

        const nameParts = payload.displayName.trim().split(' ')
        const firstName = nameParts[0] ?? ''
        const lastName = nameParts.slice(1).join(' ')

        // Ask the Aetherscribe Express API whether this user has a profile.
        // The API verifies the token itself via its authenticate middleware.
        const aetherscribeApiUrl =
            process.env.AETHERSCRIBE_API_URL ?? 'http://localhost:8811'

        const accountRes = await fetch(`${aetherscribeApiUrl}/api/v1/account/me`, {
            headers: { cookie: `auth_token=${token}` },
        })

        const ventures =
            accountRes.ok
                ? [
                      {
                          ventureName: 'aetherscribe',
                          linkedAt: new Date().toISOString(),
                          scopes: ['read', 'write'],
                          status: 'active',
                          thirdParty: false,
                      },
                  ]
                : []

        return NextResponse.json({
            user: {
                id: payload.sub,
                profile: { firstName, lastName, email: payload.email },
                ventures,
            },
        })
    } catch (err) {
        console.error('[auth/me] Token verification failed:', err)
        return NextResponse.json({ message: 'Unauthorised' }, { status: 401 })
    }
}
