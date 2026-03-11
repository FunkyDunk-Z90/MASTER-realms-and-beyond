// Session types derived from Zod schemas in @rnb/validators.

export type {
    T_Session,
    T_SessionRequest,
    T_RefreshTokenRequest,
    T_RefreshTokenResponse,
    T_LogoutRequest,
    T_TwoFactorSetup,
    T_TwoFactorVerify,
    T_SessionMetadata,
    T_TwoFactorMethod,
} from '@rnb/validators'

// ─── I_* aliases for backward compatibility ───────────────────────────────────

import type {
    T_Session,
    T_SessionRequest,
    T_RefreshTokenRequest,
    T_RefreshTokenResponse,
    T_LogoutRequest,
    T_TwoFactorSetup,
    T_TwoFactorVerify,
    T_SessionMetadata,
    T_UserProfile,
} from '@rnb/validators'

export type I_Session = T_Session
export type I_SessionRequest = T_SessionRequest
export type I_RefreshTokenRequest = T_RefreshTokenRequest
export type I_RefreshTokenResponse = T_RefreshTokenResponse
export type I_LogoutRequest = T_LogoutRequest
export type I_TwoFactorSetup = T_TwoFactorSetup
export type I_TwoFactorVerify = T_TwoFactorVerify
export type I_SessionMetadata = T_SessionMetadata

export interface I_SessionResponse {
    accessToken: string
    refreshToken: string
    expiresIn: number
    user: T_UserProfile
}

export interface I_LogoutResponse {
    message: string
}
