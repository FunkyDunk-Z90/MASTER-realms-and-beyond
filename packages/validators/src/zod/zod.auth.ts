import { z } from 'zod'
import { Z_RnBApp } from './zod.user'

// ─── Registration ─────────────────────────────────────────────────────────────

export const Z_RegisterRequest = z
    .object({
        email: z.email(),
        password: z.string().min(9),
        confirmPassword: z.string(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        agreeToTerms: z.literal(true),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

// ─── Login ────────────────────────────────────────────────────────────────────

export const Z_LoginRequest = z.object({
    email: z.email(),
    password: z.string().min(1),
})

// ─── Email Verification ───────────────────────────────────────────────────────

export const Z_VerifyEmailRequest = z.object({
    email: z.email(),
    token: z.string(),
})

export const Z_ResendVerificationRequest = z.object({
    email: z.email(),
})

// ─── Password Reset ───────────────────────────────────────────────────────────

export const Z_ForgotPasswordRequest = z.object({
    email: z.email(),
})

export const Z_ResetPasswordRequest = z
    .object({
        email: z.email(),
        token: z.string(),
        newPassword: z.string().min(8),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

export const Z_ChangePasswordRequest = z
    .object({
        currentPassword: z.string(),
        newPassword: z.string().min(8),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

// ─── Permissions ──────────────────────────────────────────────────────────────

export const Z_Permissions = z.enum([
    // Platform-level
    'platform:read:profile',
    'platform:write:profile',
    'platform:manage:users',
    'platform:manage:subscriptions',
    'platform:view:audit',
    // AetherScribe
    'aetherscribe:read:world',
    'aetherscribe:write:world',
    'aetherscribe:delete:world',
    'aetherscribe:read:entity',
    'aetherscribe:write:entity',
    'aetherscribe:delete:entity',
    'aetherscribe:read:relationship',
    'aetherscribe:write:relationship',
    'aetherscribe:delete:relationship',
    'aetherscribe:manage:collaborators',
    // ByteBurger
    'byteburger:read:orders',
    'byteburger:place:order',
    'byteburger:manage:loyalty',
    // NexusServe
    'nexusserve:manage:employees',
    'nexusserve:manage:shifts',
    'nexusserve:manage:menu',
    'nexusserve:manage:inventory',
    'nexusserve:manage:sales',
    'nexusserve:view:reports',
])

// ─── JWT Token ────────────────────────────────────────────────────────────────

export const Z_AuthToken = z.object({
    iss: z.string(),
    sub: z.string(),
    aud: z.array(z.string()),
    iat: z.number(),
    exp: z.number(),
    user: z.object({
        id: z.string(),
        email: z.email(),
        role: z.string(),
    }),
    apps: z.array(Z_RnBApp),
    permissions: z.array(Z_Permissions),
})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type T_RegisterRequest = z.infer<typeof Z_RegisterRequest>
export type T_LoginRequest = z.infer<typeof Z_LoginRequest>
export type T_VerifyEmailRequest = z.infer<typeof Z_VerifyEmailRequest>
export type T_ResendVerificationRequest = z.infer<typeof Z_ResendVerificationRequest>
export type T_ForgotPasswordRequest = z.infer<typeof Z_ForgotPasswordRequest>
export type T_ResetPasswordRequest = z.infer<typeof Z_ResetPasswordRequest>
export type T_ChangePasswordRequest = z.infer<typeof Z_ChangePasswordRequest>
export type T_Permissions = z.infer<typeof Z_Permissions>
export type T_AuthToken = z.infer<typeof Z_AuthToken>
