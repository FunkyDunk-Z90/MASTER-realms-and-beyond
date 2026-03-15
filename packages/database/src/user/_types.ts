import { Model, HydratedDocument } from 'mongoose'
import {
    T_Identity,
    T_SetPassword,
    T_VerifyPassword,
    T_PasswordResetToken,
    T_PasswordResetTokenResult,
    T_EmailVerificationToken,
    T_EmailVerificationTokenResult,
    T_EnableTwoFactor,
    T_TrustedDevice,
    T_RecordLogin,
    T_SoftDelete,
} from '@rnb/validators'

// ─── Instance Methods ─────────────────────────────────────────────────────────

export interface T_IdentityMethods {
    // ── Client serialisation ──────────────────────────────────────────────────
    /** Strips all sensitive security fields. Called by crudHandlers on every response. */
    toClient(): Omit<T_Identity, 'security'> & { id: string }

    // ── Password ──────────────────────────────────────────────────────────────
    setPassword(input: T_SetPassword): Promise<void>
    verifyPassword(input: T_VerifyPassword): Promise<boolean>
    generatePasswordResetToken(): Promise<T_PasswordResetTokenResult>
    validatePasswordResetToken(input: T_PasswordResetToken): boolean
    clearPasswordResetToken(): Promise<void>

    // ── Email Verification ────────────────────────────────────────────────────
    generateEmailVerificationToken(): Promise<T_EmailVerificationTokenResult>
    validateEmailVerificationToken(input: T_EmailVerificationToken): boolean
    verifyEmail(): Promise<void>

    // ── Verification Flags ────────────────────────────────────────────────────
    verifyPhone(): Promise<void>
    verifyIdentity(): Promise<void>
    isFullyVerified(): boolean

    // ── Two-Factor Auth ───────────────────────────────────────────────────────
    enableTwoFactor(input: T_EnableTwoFactor): Promise<void>
    disableTwoFactor(): Promise<void>

    // ── Trusted Devices ───────────────────────────────────────────────────────
    addTrustedDevice(input: T_TrustedDevice): Promise<void>
    removeTrustedDevice(input: T_TrustedDevice): Promise<void>
    isTrustedDevice(input: T_TrustedDevice): boolean

    // ── Session / IP ──────────────────────────────────────────────────────────
    recordLogin(input: T_RecordLogin): Promise<void>

    // ── Lifecycle ─────────────────────────────────────────────────────────────
    softDelete(input?: T_SoftDelete): Promise<void>
    restore(): Promise<void>
    ban(): Promise<void>
    isActive(): boolean
    requestDeletion(): Promise<void>
}

// ─── Static Methods ───────────────────────────────────────────────────────────

export interface T_IdentityStatics {
    findByEmail(
        email: string
    ): Promise<HydratedDocument<T_Identity, T_IdentityMethods> | null>
    findByPasswordResetToken(
        token: string
    ): Promise<HydratedDocument<T_Identity, T_IdentityMethods> | null>
    findByEmailVerificationToken(
        token: string
    ): Promise<HydratedDocument<T_Identity, T_IdentityMethods> | null>
}

// ─── Composed Model Type ──────────────────────────────────────────────────────

export type T_IdentityModel = Model<T_Identity, {}, T_IdentityMethods> &
    T_IdentityStatics
