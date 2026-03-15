import { z } from 'zod'
import { Z_ObjectId, Z_Timestamp } from './zod.common'
import { Z_Contact } from './zod.contact'

// ─── Shared Enums ─────────────────────────────────────────────────────────────

export const Z_IdentityStatus = z.enum(['active', 'soft-deleted', 'banned'])

export const Z_TwoFactorMethod = z.enum(['totp', 'sms', 'email', 'passkey'])

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

export const Z_IdentityProfile = z.object({
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.string().optional(),
    nationality: z.string().optional(),
    gender: z.string().optional(),
    pronouns: z.string().optional(),
    email: z.email(),
})

export const Z_IdentityMedia = z.object({
    avatarUrl: z.string().optional(),
    bannerUrl: z.string().optional(),
    avatarUpdatedAt: z.iso.datetime().optional(),
})

export const Z_IdentityPreferences = z.object({
    language: z.string(),
    timezone: z.string(),
    currency: z.string().optional(),
    dateFormat: z.string().optional(),
    theme: z.enum(['light', 'dark', 'system']),
})

export const Z_IdentityVerification = z.object({
    emailVerified: z.boolean(),
    phoneVerified: z.boolean(),
    identityVerified: z.boolean(),
    verifiedAt: z.iso.datetime().optional(),
    twoFactorEnabled: z.boolean(),
    twoFactorMethod: Z_TwoFactorMethod.optional(),
})

export const Z_IdentitySecurity = z.object({
    password: z.string().optional(),
    passwordChangedAt: z.iso.datetime().optional(),
    passwordResetToken: z.string().optional(),
    passwordResetExpiresIn: z.iso.datetime().optional(),
    emailVerificationToken: z.string().optional(),
    emailVerificationExpiresIn: z.iso.datetime().optional(),
    lastKnownIp: z.string().optional(),
    trustedDevices: z.array(Z_ObjectId),
    recoveryEmail: z.string().optional(),
    recoveryPhone: z.string().optional(),
})

export const Z_LinkedService = z.object({
    serviceName: z.string(),
    serviceId: Z_ObjectId,
    linkedAt: z.iso.datetime(),
    scopes: z.array(z.string()),
    status: Z_IdentityStatus,
})

export const Z_IdentityAudit = z.object({
    termsAcceptedAt: z.iso.datetime().optional(),
    termsVersion: z.string().optional(),
    privacyAcceptedAt: z.iso.datetime().optional(),
    marketingConsent: z.boolean(),
    dataResidency: z.string().optional(),
    deletionRequestedAt: z.iso.datetime().optional(),
})

export const Z_IdentityLifecycle = z.object({
    status: Z_IdentityStatus,
    deletedAt: z.iso.datetime().optional(),
    recoverableUntil: z.iso.datetime().optional(),
})

// ─── Root Identity Schema ──────────────────────────────────────────────────────

export const Z_IdentitySchema = z.object({
    id: Z_ObjectId,
    profile: Z_IdentityProfile,
    media: Z_IdentityMedia,
    // Contact is optional at signup — collected post-registration
    contact: Z_Contact.partial().optional(),
    preferences: Z_IdentityPreferences,
    verification: Z_IdentityVerification,
    security: Z_IdentitySecurity,
    audit: Z_IdentityAudit,
    lifecycle: Z_IdentityLifecycle,
    services: z.array(Z_LinkedService),
    lastLoginAt: z.iso.datetime().optional(),
})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type T_IdentityStatus = z.infer<typeof Z_IdentityStatus>
export type T_TwoFactorMethod = z.infer<typeof Z_TwoFactorMethod>
export type T_IdentityProfile = z.infer<typeof Z_IdentityProfile>
export type T_IdentityMedia = z.infer<typeof Z_IdentityMedia>
export type T_IdentityPreferences = z.infer<typeof Z_IdentityPreferences>
export type T_IdentityVerification = z.infer<typeof Z_IdentityVerification>
export type T_IdentitySecurity = z.infer<typeof Z_IdentitySecurity>
export type T_LinkedService = z.infer<typeof Z_LinkedService>
export type T_IdentityAudit = z.infer<typeof Z_IdentityAudit>
export type T_IdentityLifecycle = z.infer<typeof Z_IdentityLifecycle>
export type T_Identity = z.infer<typeof Z_IdentitySchema>
