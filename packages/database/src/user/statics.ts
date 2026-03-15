import { Schema } from 'mongoose'
import { T_Identity } from '@rnb/validators'
import { hashToken } from '@rnb/middleware'
import { T_IdentityModel, T_IdentityMethods } from './_types'

export function registerStaticMethods(
    schema: Schema<T_Identity, T_IdentityModel, T_IdentityMethods>
): void {
    schema.statics.findByEmail = function (email: string) {
        return this.findOne({
            'profile.email': email.toLowerCase().trim(),
            'lifecycle.status': 'active',
        })
    }

    schema.statics.findByPasswordResetToken = function (token: string) {
        return this.findOne({
            'security.passwordResetToken': hashToken(token),
            'security.passwordResetExpiresIn': {
                $gt: new Date().toISOString(),
            },
            'lifecycle.status': 'active',
        })
    }

    schema.statics.findByEmailVerificationToken = function (token: string) {
        return this.findOne({
            'security.emailVerificationToken': hashToken(token),
            'security.emailVerificationExpiresIn': {
                $gt: new Date().toISOString(),
            },
        })
    }
}
