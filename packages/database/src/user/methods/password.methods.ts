import { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import {
    Z_SetPassword,
    Z_VerifyPassword,
    Z_PasswordResetToken,
    T_Identity,
} from '@rnb/validators'
import {
    generateSecureToken,
    hashToken,
    hoursFromNow,
    safeCompareTokens,
} from '@rnb/middleware'
import { T_IdentityMethods } from '../_types'

const BCRYPT_ROUNDS = 12
const PASSWORD_RESET_TTL_HOURS = 1

export function registerPasswordMethods(
    schema: Schema<T_Identity, any, T_IdentityMethods>
): void {
    schema.methods.setPassword = async function (input) {
        const { plaintext } = Z_SetPassword.parse(input)
        this.security.password = await bcrypt.hash(plaintext, BCRYPT_ROUNDS)
        this.security.passwordChangedAt = new Date().toISOString()
        this.security.passwordResetToken = undefined
        this.security.passwordResetExpiresIn = undefined
        await this.save()
    }

    schema.methods.verifyPassword = async function (input) {
        const { plaintext } = Z_VerifyPassword.parse(input)
        if (!this.security.password) return false
        return bcrypt.compare(plaintext, this.security.password)
    }

    schema.methods.generatePasswordResetToken = async function () {
        const raw = generateSecureToken()
        const expiresAt = hoursFromNow(PASSWORD_RESET_TTL_HOURS)
        this.security.passwordResetToken = hashToken(raw)
        this.security.passwordResetExpiresIn = expiresAt
        await this.save()
        return { token: raw, expiresAt }
    }

    schema.methods.validatePasswordResetToken = function (input) {
        const { token } = Z_PasswordResetToken.parse(input)
        const { passwordResetToken, passwordResetExpiresIn } = this.security
        if (!passwordResetToken || !passwordResetExpiresIn) return false
        if (new Date(passwordResetExpiresIn) < new Date()) return false
        return safeCompareTokens(hashToken(token), passwordResetToken)
    }

    schema.methods.clearPasswordResetToken = async function () {
        this.security.passwordResetToken = undefined
        this.security.passwordResetExpiresIn = undefined
        await this.save()
    }
}
