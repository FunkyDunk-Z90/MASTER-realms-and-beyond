// Auth types are derived from Zod schemas in @rnb/validators.

export type {
    T_RegisterRequest,
    T_LoginRequest,
    T_VerifyEmailRequest,
    T_ResendVerificationRequest,
    T_ForgotPasswordRequest,
    T_ResetPasswordRequest,
    T_ChangePasswordRequest,
    T_Permissions,
    T_AuthToken,
} from '@rnb/validators'

// ─── I_* aliases for backward compatibility ───────────────────────────────────

import type {
    T_RegisterRequest,
    T_VerifyEmailRequest,
    T_ResendVerificationRequest,
    T_ForgotPasswordRequest,
    T_ResetPasswordRequest,
    T_AuthToken,
    T_UserProfile,
} from '@rnb/validators'

export type I_RegisterRequest = T_RegisterRequest
export type I_VerifyEmailRequest = T_VerifyEmailRequest
export type I_ResendVerificationRequest = T_ResendVerificationRequest
export type I_ForgotPasswordRequest = T_ForgotPasswordRequest
export type I_ResetPasswordRequest = T_ResetPasswordRequest
export type I_AuthToken = T_AuthToken

export interface I_RegisterResponse {
    user: T_UserProfile
    accessToken: string
    refreshToken: string
    expiresIn: number
    verificationRequired: boolean
}
