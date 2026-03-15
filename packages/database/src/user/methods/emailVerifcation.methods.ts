import { Schema } from 'mongoose'
import { Z_EmailVerificationToken, T_Identity } from '@rnb/validators'
import {
    generateSecureToken,
    hashToken,
    hoursFromNow,
    safeCompareTokens,
} from '@rnb/middleware'
import { T_IdentityMethods } from '../_types'

const EMAIL_VERIFICATION_TTL_HOURS = 24

export function registerEmailVerificationMethods(
    schema: Schema<T_Identity, any, T_IdentityMethods>
): void {
    schema.methods.generateEmailVerificationToken = async function () {
        const raw = generateSecureToken()
        const expiresAt = hoursFromNow(EMAIL_VERIFICATION_TTL_HOURS)
        this.security.emailVerificationToken = hashToken(raw)
        this.security.emailVerificationExpiresIn = expiresAt
        await this.save()
        return { token: raw, expiresAt }
    }

    schema.methods.validateEmailVerificationToken = function (input) {
        const { token } = Z_EmailVerificationToken.parse(input)
        const { emailVerificationToken, emailVerificationExpiresIn } =
            this.security
        if (!emailVerificationToken || !emailVerificationExpiresIn) return false
        if (new Date(emailVerificationExpiresIn) < new Date()) return false
        return safeCompareTokens(hashToken(token), emailVerificationToken)
    }

    schema.methods.verifyEmail = async function () {
        this.verification.emailVerified = true
        this.security.emailVerificationToken = undefined
        this.security.emailVerificationExpiresIn = undefined
        await this.save()
    }
}
