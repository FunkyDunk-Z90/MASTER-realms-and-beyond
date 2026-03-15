import { Schema, Types } from 'mongoose'
import {
    Z_EnableTwoFactor,
    Z_TrustedDevice,
    Z_RecordLogin,
    T_Identity,
} from '@rnb/validators'
import { T_IdentityMethods } from '../_types'

// ─── Verification Flags ───────────────────────────────────────────────────────

export function registerVerificationMethods(
    schema: Schema<T_Identity, any, T_IdentityMethods>
): void {
    schema.methods.verifyPhone = async function () {
        this.verification.phoneVerified = true
        await this.save()
    }

    schema.methods.verifyIdentity = async function () {
        this.verification.identityVerified = true
        this.verification.verifiedAt = new Date().toISOString()
        await this.save()
    }

    schema.methods.isFullyVerified = function () {
        const { emailVerified, phoneVerified, identityVerified } =
            this.verification
        return emailVerified && phoneVerified && identityVerified
    }
}

// ─── Two-Factor Auth ──────────────────────────────────────────────────────────

export function registerTwoFactorMethods(
    schema: Schema<T_Identity, any, T_IdentityMethods>
): void {
    schema.methods.enableTwoFactor = async function (input) {
        const { method } = Z_EnableTwoFactor.parse(input)
        if (this.verification.twoFactorEnabled) {
            throw new Error('Two-factor authentication is already enabled.')
        }
        this.verification.twoFactorEnabled = true
        this.verification.twoFactorMethod = method
        await this.save()
    }

    schema.methods.disableTwoFactor = async function () {
        this.verification.twoFactorEnabled = false
        this.verification.twoFactorMethod = undefined
        await this.save()
    }
}

// ─── Trusted Devices ──────────────────────────────────────────────────────────

export function registerTrustedDeviceMethods(
    schema: Schema<T_Identity, any, T_IdentityMethods>
): void {
    schema.methods.addTrustedDevice = async function (input) {
        const { deviceId } = Z_TrustedDevice.parse(input)
        if (this.isTrustedDevice({ deviceId })) return
        this.security.trustedDevices.push(new Types.ObjectId(deviceId))
        await this.save()
    }

    schema.methods.removeTrustedDevice = async function (input) {
        const { deviceId } = Z_TrustedDevice.parse(input)
        this.security.trustedDevices = this.security.trustedDevices.filter(
            (id) => id.toString() !== deviceId
        )
        await this.save()
    }

    schema.methods.isTrustedDevice = function (input) {
        const { deviceId } = Z_TrustedDevice.parse(input)
        return this.security.trustedDevices.some(
            (id) => id.toString() === deviceId
        )
    }
}

// ─── Session / IP ─────────────────────────────────────────────────────────────

export function registerSessionMethods(
    schema: Schema<T_Identity, any, T_IdentityMethods>
): void {
    schema.methods.recordLogin = async function (input) {
        const { ip } = Z_RecordLogin.parse(input)
        this.security.lastKnownIp = ip
        this.lastLoginAt = new Date().toISOString()
        await this.save()
    }
}
