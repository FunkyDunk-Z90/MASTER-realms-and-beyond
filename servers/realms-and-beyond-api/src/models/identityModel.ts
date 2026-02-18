import { Schema, model, Document, Types } from 'mongoose'
import bcrypt from 'bcrypt'
import { createHash, randomBytes } from 'crypto'

import {
    T_IdentityStatus,
    I_IdentityLifecycle,
    I_IdentityProfile,
    I_IdentityMedia,
    I_IdentityPreferences,
    I_IdentityVerification,
    I_IdentitySecurity,
    I_IdentityAccountRelations,
    I_IdentityAudit,
    I_Identity,
    I_ContactProps,
    I_GenderIdentity,
    I_Pronouns,
} from '@rnb/types'
import { formatDate } from '@rnb/security'

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── Public Info Return Type ──────────────────────────────────────────────────

interface I_IdentityPublicInfo extends Omit<
    Partial<I_Identity>,
    'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'
> {
    id: Types.ObjectId
    createdAt?: string
    updatedAt?: string
    lastLoginAt?: string
}

// ─── Document Interface ───────────────────────────────────────────────────────

export interface I_IdentityDocument
    extends
        Omit<I_Identity, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>,
        Document {
    lastLoginAt?: Date
    passwordConfirm?: string
    createdAt: Date
    updatedAt: Date
    correctPassword(candidatePassword: string): Promise<boolean>
    changedPasswordAfter(JWTTimestamp: Date): boolean
    createPasswordResetToken(): string
    getPublicInfo(): I_IdentityPublicInfo
}

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const PronounsSchema = new Schema<I_Pronouns>(
    {
        subject: { type: String, required: true },
        object: { type: String, required: true },
        possessive: { type: String, required: true },
        reflexive: { type: String, required: true },
    },
    { _id: false }
)

const GenderIdentitySchema = new Schema<I_GenderIdentity>(
    {
        primary: { type: String, required: true },
        additional: { type: [String], default: undefined },
        pronouns: { type: PronounsSchema, default: undefined },
        selfDescribed: { type: String, default: undefined },
    },
    { _id: false }
)

const ContactSchema = new Schema<I_ContactProps>(
    {
        email: { type: String, required: true, lowercase: true, trim: true },
        phone: {
            phoneNumber: { type: String, default: undefined },
            countryCode: { type: String, default: undefined },
        },
    },
    { _id: false }
)

const IdentityProfileSchema = new Schema<I_IdentityProfile>(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        dateOfBirth: { type: String, default: undefined },
        nationality: { type: String, default: undefined },
        gender: { type: GenderIdentitySchema, default: undefined },
        pronouns: { type: PronounsSchema, default: undefined },
    },
    { _id: false }
)

const IdentityMediaSchema = new Schema<I_IdentityMedia>(
    {
        avatarUrl: { type: String, default: undefined },
        bannerUrl: { type: String, default: undefined },
        avatarUpdatedAt: { type: Date, default: undefined },
    },
    { _id: false }
)

const IdentityPreferencesSchema = new Schema<I_IdentityPreferences>(
    {
        language: { type: String, required: true, default: 'en-US' },
        timezone: { type: String, required: true, default: 'UTC' },
        currency: { type: String, default: undefined },
        dateFormat: { type: String, default: undefined },
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'] as const,
            default: 'system',
        },
    },
    { _id: false }
)

const IdentityVerificationSchema = new Schema<I_IdentityVerification>(
    {
        emailVerified: { type: Boolean, required: true, default: false },
        phoneVerified: { type: Boolean, required: true, default: false },
        identityVerified: { type: Boolean, required: true, default: false },
        verifiedAt: { type: Date, default: undefined },
        twoFactorEnabled: { type: Boolean, required: true, default: false },
        twoFactorMethod: {
            type: String,
            enum: ['totp', 'sms', 'email', 'passkey'] as const,
            default: undefined,
        },
    },
    { _id: false }
)

const IdentitySecuritySchema = new Schema<I_IdentitySecurity>(
    {
        passwordHash: { type: String, required: true },
        passwordChangedAt: { type: Date, default: undefined },

        passwordResetToken: { type: String, default: undefined },
        passwordResetExpiresIn: { type: Date, default: undefined },

        emailVerificationToken: { type: String, default: undefined },
        emailVerificationExpiresIn: { type: Date, default: undefined },

        lastKnownIp: { type: String, default: undefined },
        trustedDevices: { type: [Types.ObjectId], default: [] },
        recoveryEmail: {
            type: String,
            lowercase: true,
            trim: true,
            default: undefined,
        },
        recoveryPhone: { type: String, default: undefined },
    },
    { _id: false }
)

const IdentityAccountRelationsSchema = new Schema<I_IdentityAccountRelations>(
    {
        linkedAccounts: {
            type: [Schema.Types.ObjectId],
            ref: 'Account',
            default: [],
        },
        parentIdentity: {
            type: Schema.Types.ObjectId,
            ref: 'Identity',
            default: undefined,
        },
        managedIdentities: {
            type: [Schema.Types.ObjectId],
            ref: 'Identity',
            default: [],
        },
    },
    { _id: false }
)

const IdentityAuditSchema = new Schema<I_IdentityAudit>(
    {
        termsAcceptedAt: { type: Date, default: undefined },
        termsVersion: { type: String, default: undefined },
        privacyAcceptedAt: { type: Date, default: undefined },
        marketingConsent: { type: Boolean, required: true, default: false },
        dataResidency: { type: String, default: undefined },
        deletionRequestedAt: { type: Date, default: undefined },
    },
    { _id: false }
)

const IdentityLifecycleSchema = new Schema<I_IdentityLifecycle>(
    {
        status: {
            type: String,
            enum: [
                'active',
                'soft-deleted',
                'banned',
            ] as const satisfies T_IdentityStatus[],
            required: true,
            default: 'active',
        },
        deletedAt: { type: Date, default: undefined },
        recoverableUntil: { type: Date, default: undefined },
    },
    { _id: false }
)

// ─── Root Schema ──────────────────────────────────────────────────────────────

const IdentitySchema = new Schema<I_IdentityDocument>(
    {
        profile: { type: IdentityProfileSchema, required: true },
        media: { type: IdentityMediaSchema, default: () => ({}) },
        contact: { type: ContactSchema, required: true },
        preferences: { type: IdentityPreferencesSchema, default: () => ({}) },
        verification: { type: IdentityVerificationSchema, default: () => ({}) },
        security: { type: IdentitySecuritySchema, required: true },
        accounts: { type: IdentityAccountRelationsSchema, default: () => ({}) },
        audit: { type: IdentityAuditSchema, default: () => ({}) },
        lifecycle: { type: IdentityLifecycleSchema, default: () => ({}) },
        lastLoginAt: { type: Date, default: undefined },
        aetherscribeAccount: {
            type: Schema.Types.ObjectId,
            ref: 'AetherscribeAccount',
            default: undefined,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

// ─── Indexes ──────────────────────────────────────────────────────────────────

IdentitySchema.index({ 'contact.email': 1 }, { unique: true })
IdentitySchema.index({ 'lifecycle.status': 1 })
IdentitySchema.index({ aetherscribeAccount: 1 })
IdentitySchema.index({ 'accounts.linkedAccounts': 1 })
IdentitySchema.index({ 'lifecycle.recoverableUntil': 1 }, { sparse: true })

// ─── Methods ──────────────────────────────────────────────────────────────────

IdentitySchema.pre<I_IdentityDocument>('save', async function () {
    if (!this.isModified('security.passwordHash')) return

    if (!this.security?.passwordHash) return

    this.security.passwordHash = await bcrypt.hash(
        this.security.passwordHash,
        12
    )

    if (!this.isNew) {
        this.security.passwordChangedAt = new Date(Date.now() - 1000)
    }
})

IdentitySchema.methods.correctPassword = async function (
    candidatePassword: string
): Promise<boolean> {
    console.log('Running compare')

    return await bcrypt.compare(candidatePassword, this.security.passwordHash)
}

IdentitySchema.methods.changedPasswordAfter = function (
    JWTTimestamp: Date
): boolean {
    if (this.security.passwordChangedAt) {
        const changedTimestamp = this.security.passwordChangedAt.getTime()

        return JWTTimestamp.getTime() < changedTimestamp
    }

    return false
}

IdentitySchema.methods.createPasswordResetToken = function (): string {
    const resetToken = randomBytes(32).toString('hex')

    this.security.passwordResetToken = createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.security.passwordResetExpiresIn = new Date(
        Date.now() + 10 * 60 * 1000 // 10 minutes
    )

    return resetToken
}

IdentitySchema.methods.getPublicInfo = function (): I_IdentityPublicInfo {
    const {
        profile,
        media,
        preferences,
        verification,
        lifecycle,
        aetherscribeAccount,
    } = this
    return {
        id: this._id,
        profile,
        media,
        contact: { email: this.contact.email },
        preferences,
        verification: {
            phoneVerified: verification.phoneVerified,
            emailVerified: verification.emailVerified,
            twoFactorEnabled: verification.twoFactorEnabled,
        },
        lifecycle,
        aetherscribeAccount,
        lastLoginAt: formatDate(this.lastLoginAt),
        createdAt: formatDate(this.createdAt),
        updatedAt: formatDate(this.updatedAt),
    }
}

// ─── Model ────────────────────────────────────────────────────────────────────

export const IdentityModel = model<I_IdentityDocument>(
    'Identity',
    IdentitySchema
)
