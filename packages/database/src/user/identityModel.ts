import { Schema, model } from 'mongoose'
import { T_Identity } from '@rnb/validators'
import { T_IdentityModel, T_IdentityMethods } from './_types'
import {
    profileSchema,
    auditSchema,
    lifecycleSchema,
    mediaSchema,
    preferencesSchema,
    securitySchema,
    verificationSchema,
    venturesSchema,
    contactSchema,
} from './_schemas'
import { registerPasswordMethods } from './methods/password.methods'
import { registerEmailVerificationMethods } from './methods/emailVerifcation.methods'
import {
    registerVerificationMethods,
    registerTwoFactorMethods,
    registerTrustedDeviceMethods,
    registerSessionMethods,
} from './methods/security.methods'
import { registerLifecycleMethods } from './methods/lifecycle.methods'
import { registerStaticMethods } from './statics'

// ─── Root Schema ──────────────────────────────────────────────────────────────

const identitySchema = new Schema<
    T_Identity,
    T_IdentityModel,
    T_IdentityMethods
>(
    {
        profile: profileSchema,
        contact: contactSchema,
        audit: auditSchema,
        lifecycle: lifecycleSchema,
        media: mediaSchema,
        preferences: preferencesSchema,
        security: securitySchema,
        verification: verificationSchema,
        lastLoginAt: String,
        ventures: [venturesSchema],
    },
    { timestamps: true }
)

// ─── toClient ─────────────────────────────────────────────────────────────────
// Strips sensitive security fields before any response leaves the server.
// Required by crudHandlers — every outbound doc goes through doc.toClient().

identitySchema.methods.toClient = function () {
    const obj = this.toObject()
    const {
        password,
        passwordResetToken,
        passwordResetExpiresIn,
        emailVerificationToken,
        emailVerificationExpiresIn,
        ...safeSecurity
    } = obj.security ?? {}

    const { _id, __v, ...rest } = obj

    return {
        ...rest,
        id: _id?.toString(),
        security: safeSecurity,
    }
}
// ─── Register Methods ─────────────────────────────────────────────────────────

registerPasswordMethods(identitySchema)
registerEmailVerificationMethods(identitySchema)
registerVerificationMethods(identitySchema)
registerTwoFactorMethods(identitySchema)
registerTrustedDeviceMethods(identitySchema)
registerSessionMethods(identitySchema)
registerLifecycleMethods(identitySchema)
registerStaticMethods(identitySchema)

// ─── Model ────────────────────────────────────────────────────────────────────

const Identity = model<T_Identity, T_IdentityModel>('Identity', identitySchema)

export default Identity
