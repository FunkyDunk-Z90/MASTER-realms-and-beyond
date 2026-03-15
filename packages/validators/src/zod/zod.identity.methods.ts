import { z } from 'zod'
import { Z_ObjectId } from './zod.common'
import { Z_TwoFactorMethod } from './zod.identity.schema'

// ─── Password ─────────────────────────────────────────────────────────────────

export const Z_SetPassword = z.object({
    plaintext: z
        .string()
        .min(8, 'Password must be at least 8 characters.')
        .max(128, 'Password must not exceed 128 characters.')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
        .regex(/[0-9]/, 'Password must contain at least one number.')
        .regex(
            /[^A-Za-z0-9]/,
            'Password must contain at least one special character.'
        ),
})

export const Z_VerifyPassword = z.object({
    plaintext: z.string().min(1, 'Password is required.'),
})

export const Z_PasswordResetToken = z.object({
    token: z
        .string()
        .min(1, 'Token is required.')
        .regex(/^[a-f0-9]{64}$/, 'Invalid token format.'),
})

export const Z_PasswordResetTokenResult = z.object({
    token: z.string(),
    expiresAt: z.iso.datetime(),
})

// ─── Email Verification ───────────────────────────────────────────────────────

export const Z_EmailVerificationToken = z.object({
    token: z
        .string()
        .min(1, 'Token is required.')
        .regex(/^[a-f0-9]{64}$/, 'Invalid token format.'),
})

export const Z_EmailVerificationTokenResult = z.object({
    token: z.string(),
    expiresAt: z.iso.datetime(),
})

// ─── Two-Factor Auth ──────────────────────────────────────────────────────────

export const Z_EnableTwoFactor = z.object({
    method: Z_TwoFactorMethod,
})

// ─── Trusted Devices ──────────────────────────────────────────────────────────

export const Z_TrustedDevice = z.object({
    deviceId: Z_ObjectId,
})

// ─── Session / IP ─────────────────────────────────────────────────────────────
// Accept any non-empty IP string — Express can return IPv4, IPv6, and
// IPv6-mapped IPv4 (e.g. ::ffff:127.0.0.1) depending on the platform.

export const Z_RecordLogin = z.object({
    ip: z.string().min(1, 'IP address is required.'),
})

// ─── Lifecycle ────────────────────────────────────────────────────────────────

export const Z_SoftDelete = z.object({
    gracePeriodDays: z
        .number()
        .int()
        .min(1, 'Grace period must be at least 1 day.')
        .max(90, 'Grace period cannot exceed 90 days.')
        .default(30),
})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type T_SetPassword = z.infer<typeof Z_SetPassword>
export type T_VerifyPassword = z.infer<typeof Z_VerifyPassword>
export type T_PasswordResetToken = z.infer<typeof Z_PasswordResetToken>
export type T_PasswordResetTokenResult = z.infer<
    typeof Z_PasswordResetTokenResult
>
export type T_EmailVerificationToken = z.infer<typeof Z_EmailVerificationToken>
export type T_EmailVerificationTokenResult = z.infer<
    typeof Z_EmailVerificationTokenResult
>
export type T_EnableTwoFactor = z.infer<typeof Z_EnableTwoFactor>
export type T_TrustedDevice = z.infer<typeof Z_TrustedDevice>
export type T_RecordLogin = z.infer<typeof Z_RecordLogin>
export type T_SoftDelete = z.infer<typeof Z_SoftDelete>
