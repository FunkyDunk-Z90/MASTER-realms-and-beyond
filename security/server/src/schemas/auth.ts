import { z } from 'zod'

// ─── GET /authorize query parameters ──────────────────────────────────────────

export const AuthorizeQuerySchema = z.object({
    client_id: z.string().min(1),
    redirect_uri: z.string().url(),
    state: z.string().min(16),
    code_challenge: z.string().min(43).max(128),
    code_challenge_method: z.literal('S256'),
    scope: z.string().default('profile email'),
})

export type AuthorizeQuery = z.infer<typeof AuthorizeQuerySchema>

// ─── POST /authorize body (login form) ────────────────────────────────────────

export const LoginBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

export type LoginBody = z.infer<typeof LoginBodySchema>

// ─── POST /token body ─────────────────────────────────────────────────────────

export const TokenBodySchema = z.object({
    code: z.string().min(1),
    code_verifier: z.string().min(43).max(128),
    client_id: z.string().min(1),
    client_secret: z.string().optional(), // confidential clients only
    redirect_uri: z.string().url(),
})

export type TokenBody = z.infer<typeof TokenBodySchema>

// ─── POST /token/refresh body ─────────────────────────────────────────────────

export const RefreshTokenBodySchema = z.object({
    refresh_token: z.string().min(1),
    client_id: z.string().min(1),
})

export type RefreshTokenBody = z.infer<typeof RefreshTokenBodySchema>

// ─── POST /register body ──────────────────────────────────────────────────────

export const RegisterBodySchema = z
    .object({
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100),
        email: z.string().email(),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        passwordConfirm: z.string().min(1),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: 'Passwords do not match',
        path: ['passwordConfirm'],
    })

export type RegisterBody = z.infer<typeof RegisterBodySchema>

// ─── POST /logout body ────────────────────────────────────────────────────────

export const LogoutBodySchema = z.object({
    post_logout_redirect_uri: z.string().url().optional(),
})

export type LogoutBody = z.infer<typeof LogoutBodySchema>
