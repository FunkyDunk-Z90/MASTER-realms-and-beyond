import { createVerify, createPublicKey } from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { connectDB } from '../../../../../lib/db'
import { AetherscribeProfile } from '@rnb/database'
import mongoose from 'mongoose'

// ─── GET /api/v1/user/me ───────────────────────────────────────────────────────
// Local proxy for AuthProvider. Reads the RS256 auth_token cookie, verifies it
// against the auth server's JWKS, and returns user data shaped as I_AuthUser.
//
// NEXT_PUBLIC_API_URL in Aetherscribe must point to http://localhost:3000 so
// AuthProvider calls this route instead of the auth server's HS256 endpoint.

function base64urlDecode(str: string): string {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const padding = '='.repeat((4 - (base64.length % 4)) % 4)
    return Buffer.from(base64 + padding, 'base64').toString('utf8')
}

interface JwkKey {
    kty: string
    use?: string
    alg?: string
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
    iss: string
    aud: string
    exp: number
    iat: number
}

async function verifyRS256(token: string): Promise<JwtPayload> {
    const parts = token.split('.')
    if (parts.length !== 3) throw new Error('Invalid JWT format')

    const [headerB64, payloadB64, signatureB64] = parts as [string, string, string]
    const header = JSON.parse(base64urlDecode(headerB64)) as { kid?: string; alg: string }

    if (header.alg !== 'RS256') throw new Error('Unexpected JWT algorithm')

    const authServerUrl = process.env.RNB_AUTH_SERVER_URL ?? 'http://localhost:2611'
    const jwksRes = await fetch(`${authServerUrl}/.well-known/jwks.json`, {
        next: { revalidate: 3600 }, // cache the public key for 1 hour
    })

    if (!jwksRes.ok) throw new Error('Failed to fetch JWKS')

    const { keys } = (await jwksRes.json()) as { keys: JwkKey[] }
    const jwk = keys.find((k) => !header.kid || k.kid === header.kid)
    if (!jwk) throw new Error('No matching signing key in JWKS')

    const publicKey = createPublicKey({ key: jwk as unknown as Parameters<typeof createPublicKey>[0], format: 'jwk' })

    const verifier = createVerify('RSA-SHA256')
    verifier.update(`${headerB64}.${payloadB64}`)
    const valid = verifier.verify(publicKey, Buffer.from(signatureB64, 'base64url'))
    if (!valid) throw new Error('Invalid JWT signature')

    const payload = JSON.parse(base64urlDecode(payloadB64)) as JwtPayload

    if (payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('JWT expired')
    }

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

        // Split displayName into firstName / lastName for I_AuthUser shape
        const nameParts = payload.displayName.trim().split(' ')
        const firstName = nameParts[0] ?? ''
        const lastName = nameParts.slice(1).join(' ')

        // Check if this user has an Aetherscribe profile
        await connectDB()
        const profile = await AetherscribeProfile.findOne({
            identityId: new mongoose.Types.ObjectId(payload.sub),
        }).select('_id username createdAt').lean()

        const services = profile
            ? [
                  {
                      serviceName: 'aetherscribe',
                      serviceId: profile._id.toString(),
                      linkedAt: profile.createdAt.toISOString(),
                      scopes: ['read', 'write'],
                      status: 'active',
                  },
              ]
            : []

        return NextResponse.json({
            user: {
                id: payload.sub,
                profile: {
                    firstName,
                    lastName,
                    email: payload.email,
                },
                services,
            },
        })
    } catch (err) {
        console.error('[auth/me] Token verification failed:', err)
        return NextResponse.json({ message: 'Unauthorised' }, { status: 401 })
    }
}
