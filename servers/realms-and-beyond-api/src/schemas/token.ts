import { z } from 'zod'

// ─── JWT payload (RS256 tokens issued to member apps) ─────────────────────────

export const JwtPayloadSchema = z.object({
    sub: z.string().min(1),
    email: z.string().email(),
    displayName: z.string(),
    roles: z.array(z.string()),
    scopes: z.array(z.string()),
    iss: z.literal('https://auth.realmsandbeyond.com'),
    aud: z.string().min(1),
    exp: z.number().int(),
    iat: z.number().int(),
})

export type JwtPayload = z.infer<typeof JwtPayloadSchema>

// ─── Session user stored in member app sessions ───────────────────────────────

export const SessionUserSchema = z.object({
    id: z.string().min(1),
    email: z.string().email(),
    displayName: z.string(),
    roles: z.array(z.string()),
    scopes: z.array(z.string()),
})

export type SessionUser = z.infer<typeof SessionUserSchema>

// ─── Token exchange response ──────────────────────────────────────────────────

export const TokenResponseSchema = z.object({
    access_token: z.string().min(1),
    token_type: z.literal('Bearer'),
    expires_in: z.number().int().positive(),
    refresh_token: z.string().min(1),
    scope: z.string(),
})

export type TokenResponse = z.infer<typeof TokenResponseSchema>
