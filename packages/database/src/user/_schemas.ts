import { Schema, Types } from 'mongoose'
import {
    T_IdentityProfile,
    T_IdentityAudit,
    T_IdentityLifecycle,
    T_IdentityMedia,
    T_IdentityPreferences,
    T_IdentitySecurity,
    T_IdentityVerification,
    T_LinkedService,
} from '@rnb/validators'
import { contactSchema } from '../common/contactModel'

export { contactSchema }

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profileSchema = new Schema<T_IdentityProfile>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        dateOfBirth: String,
        gender: String,
        nationality: String,
        pronouns: String,
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
    },
    { _id: false }
)

// ─── Audit ────────────────────────────────────────────────────────────────────

export const auditSchema = new Schema<T_IdentityAudit>(
    {
        dataResidency: String,
        deletionRequestedAt: String,
        marketingConsent: { type: Boolean, default: false },
        privacyAcceptedAt: String,
        termsAcceptedAt: String,
        termsVersion: String,
    },
    { _id: false }
)

// ─── Lifecycle ────────────────────────────────────────────────────────────────

export const lifecycleSchema = new Schema<T_IdentityLifecycle>(
    {
        deletedAt: String,
        recoverableUntil: String,
        status: {
            type: String,
            enum: ['active', 'soft-deleted', 'banned'],
            default: 'active',
            index: true,
        },
    },
    { _id: false }
)

// ─── Media ────────────────────────────────────────────────────────────────────

export const mediaSchema = new Schema<T_IdentityMedia>(
    {
        avatarUpdatedAt: String,
        avatarUrl: String,
        bannerUrl: String,
    },
    { _id: false }
)

// ─── Preferences ──────────────────────────────────────────────────────────────

export const preferencesSchema = new Schema<T_IdentityPreferences>(
    {
        currency: String,
        dateFormat: String,
        language: { type: String, required: true },
        timezone: { type: String, required: true },
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system',
        },
    },
    { _id: false }
)

// ─── Security ─────────────────────────────────────────────────────────────────

export const securitySchema = new Schema<T_IdentitySecurity>(
    {
        trustedDevices: [{ type: Types.ObjectId }],
        emailVerificationExpiresIn: String,
        emailVerificationToken: { type: String, index: { sparse: true } },
        lastKnownIp: String,
        passwordChangedAt: String,
        password: String,
        passwordResetExpiresIn: String,
        passwordResetToken: { type: String, index: { sparse: true } },
        recoveryEmail: String,
        recoveryPhone: String,
    },
    { _id: false }
)

// ─── Verification ─────────────────────────────────────────────────────────────

export const verificationSchema = new Schema<T_IdentityVerification>(
    {
        emailVerified: { type: Boolean, required: true, default: false },
        identityVerified: { type: Boolean, default: false },
        phoneVerified: { type: Boolean, default: false },
        twoFactorEnabled: { type: Boolean, default: false },
        twoFactorMethod: {
            type: String,
            enum: ['totp', 'sms', 'email', 'passkey'],
        },
        verifiedAt: String,
    },
    { _id: false }
)

// ─── Linked Services ──────────────────────────────────────────────────────────

export const servicesSchema = new Schema<T_LinkedService>(
    {
        serviceName: { type: String, required: true },
        serviceId: { type: Types.ObjectId, required: true },
        linkedAt: { type: String, required: true },
        scopes: [{ type: String, required: true }],
        status: {
            type: String,
            enum: ['active', 'soft-deleted', 'banned'],
        },
    },
    { _id: false }
)
