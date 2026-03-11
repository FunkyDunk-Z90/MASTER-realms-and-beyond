import { Schema, model, Document, Types } from 'mongoose'
import bcrypt from 'bcrypt'
import { createHash, randomBytes } from 'crypto'

import { I_Identity } from '@rnb/types'
import { formatDate } from '@rnb/security'

interface I_IdentityPublicInfo extends Omit<
    Partial<I_Identity>,
    'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'
> {
    id: Types.ObjectId
    createdAt: string | Date | undefined
    updatedAt: string | Date | undefined
    lastLoginAt: string | Date | undefined
}

// ─── Document Interface ───────────────────────────────────────────────────────

export interface I_IdentityDocument extends I_IdentityPublicInfo, Document {
    passwordConfirm?: string
    correctPassword(candidatePassword: string): Promise<boolean>
    changedPasswordAfter(JWTTimestamp: Date): boolean
    createPasswordResetToken(): string
    getPublicInfo(): I_IdentityPublicInfo
}

// ─── Root Schema ──────────────────────────────────────────────────────────────

const IdentitySchema = new Schema<I_IdentityDocument>(
    {},
    {
        timestamps: true,
        versionKey: false,
    }
)

// ─── Indexes ──────────────────────────────────────────────────────────────────

IdentitySchema.index({ 'contact.email': 1 }, { unique: true })
IdentitySchema.index({ 'lifecycle.status': 1 })
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
    const { profile, media, preferences, verification, lifecycle } = this
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
