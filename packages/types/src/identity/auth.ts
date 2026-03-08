import type { I_UserProfile, T_RnBApp } from './user'

// ============================================================================
// REGISTRATION & AUTH FLOWS
// ============================================================================

export interface I_RegisterRequest {
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
    agreeToTerms: boolean
}

export interface I_RegisterResponse {
    user: I_UserProfile
    accessToken: string
    refreshToken: string
    expiresIn: number
    verificationRequired: boolean
}

// ============================================================================
// PERMISSIONS
// Scoped to platform or a specific RnB app.
// Format: '<app|platform>:<action>:<resource>'
// ============================================================================

export type T_Permissions =
    // Platform-level (admin/support tools)
    | 'platform:read:profile'
    | 'platform:write:profile'
    | 'platform:manage:users'
    | 'platform:manage:subscriptions'
    | 'platform:view:audit'
    // AetherScribe
    | 'aetherscribe:read:world'
    | 'aetherscribe:write:world'
    | 'aetherscribe:delete:world'
    | 'aetherscribe:read:entity'
    | 'aetherscribe:write:entity'
    | 'aetherscribe:delete:entity'
    | 'aetherscribe:read:relationship'
    | 'aetherscribe:write:relationship'
    | 'aetherscribe:delete:relationship'
    | 'aetherscribe:manage:collaborators'
    // ByteBurger
    | 'byteburger:read:orders'
    | 'byteburger:place:order'
    | 'byteburger:manage:loyalty'
    // NexusServe
    | 'nexusserve:manage:employees'
    | 'nexusserve:manage:shifts'
    | 'nexusserve:manage:menu'
    | 'nexusserve:manage:inventory'
    | 'nexusserve:manage:sales'
    | 'nexusserve:view:reports'

// ============================================================================
// JWT TOKEN SHAPE
// ============================================================================

/**
 * Decoded JWT payload issued by the RnB auth service.
 * A single token grants access to all apps the user has connected.
 */
export interface I_AuthToken {
    /** Issuer — 'realms-and-beyond' */
    iss: string
    /** Subject — userId */
    sub: string
    /** Audience — which RnB services can accept this token */
    aud: string[]
    iat: number
    exp: number
    user: {
        id: string
        email: string
        role: string
    }
    /** Apps this user has connected — gates app-level API access */
    apps: T_RnBApp[]
    permissions: T_Permissions[]
}

// ============================================================================
// EMAIL VERIFICATION & PASSWORD
// ============================================================================

export interface I_VerifyEmailRequest {
    email: string
    token: string
}

export interface I_ResendVerificationRequest {
    email: string
}

export interface I_ForgotPasswordRequest {
    email: string
}

export interface I_ResetPasswordRequest {
    email: string
    token: string
    newPassword: string
    confirmPassword: string
}

// ============================================================================
// OAUTH
// ============================================================================

export interface I_OAuthRequest {
    provider: 'google' | 'github' | 'microsoft'
    code: string
    redirectUrl: string
}

export interface I_OAuthCallback {
    user: I_UserProfile
    isNewUser: boolean
    accessToken: string
    refreshToken: string
}
