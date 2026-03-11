import { z } from 'zod'
import { Z_ObjectId, Z_Timestamp } from './zod.common'
import { Z_TwoFactorMethod } from './zod.identitySchema'

// ─── Session ──────────────────────────────────────────────────────────────────

export const Z_Session = z.object({
    id: Z_ObjectId,
    userId: Z_ObjectId,
    refreshToken: z.string(),
    ipAddress: z.string(),
    userAgent: z.string(),
    expiresAt: z.iso.datetime(),
    createdAt: Z_Timestamp,
})

export const Z_SessionRequest = z.object({
    email: z.email(),
    password: z.string(),
    rememberMe: z.boolean().optional(),
})

export const Z_RefreshTokenRequest = z.object({
    accessToken: z.string(),
})

export const Z_RefreshTokenResponse = z.object({
    accessToken: z.string(),
    expiresIn: z.number(),
})

export const Z_LogoutRequest = z.object({
    refreshToken: z.string().optional(),
})

// ─── Two-Factor ───────────────────────────────────────────────────────────────

export const Z_TwoFactorSetup = z.object({
    method: Z_TwoFactorMethod,
    secret: z.string().optional(),
    backupCodes: z.array(z.string()).optional(),
    qrCode: z.string().optional(),
})

export const Z_TwoFactorVerify = z.object({
    code: z.string(),
    method: Z_TwoFactorMethod,
})

// ─── Session Metadata ─────────────────────────────────────────────────────────

export const Z_SessionMetadata = z.object({
    deviceName: z.string().optional(),
    deviceType: z.enum(['mobile', 'tablet', 'desktop', 'console']).optional(),
    os: z.string().optional(),
    browser: z.string().optional(),
    lastActivity: Z_Timestamp,
})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type T_Session = z.infer<typeof Z_Session>
export type T_SessionRequest = z.infer<typeof Z_SessionRequest>
export type T_RefreshTokenRequest = z.infer<typeof Z_RefreshTokenRequest>
export type T_RefreshTokenResponse = z.infer<typeof Z_RefreshTokenResponse>
export type T_LogoutRequest = z.infer<typeof Z_LogoutRequest>
export type T_TwoFactorSetup = z.infer<typeof Z_TwoFactorSetup>
export type T_TwoFactorVerify = z.infer<typeof Z_TwoFactorVerify>
export type T_SessionMetadata = z.infer<typeof Z_SessionMetadata>
