import type { I_UserProfile } from './user'

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

export interface I_AuthToken {
    iss: string
    sub: string
    aud: string[]
    iat: number
    exp: number
    user: {
        id: string
        email: string
        role: string
    }
    permissions: string[]
}

export type T_Permissions =
    | 'read:profile'
    | 'write:profile'
    | 'read:world'
    | 'write:world'
    | 'delete:word'
    | 'read:entity'
    | 'write:entity'
    | 'delete:entity'
    | 'read:relationship'
    | 'write:relationship'
    | 'delete:relationship'
    | 'manage:users'
    | 'manage:subscriptions'
    | 'view:audit'
    | 'manage:employees'
    | 'manage:shifts'
    | 'manage:menu'
    | 'manage:sales'

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

export interface I_0AuthRequest {
    provider: 'google' | 'github' | 'microsoft'
    code: string
    redirecttUrl: string
}

export interface I_0AuthCallbak {
    user: I_UserProfile
    isNewUser: boolean
    accessToken: string
    refreshToken: string
}
