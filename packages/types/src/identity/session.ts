import { T_ObjectId, T_Timestamp } from '../global/common'
import { I_UserProfile } from './user'

export interface I_Session {
    id: T_ObjectId
    userId: T_ObjectId
    refreshToken: string
    ipAddress: string
    userAgent: string
    expiresAt: Date
    createdAt: T_Timestamp
}

export interface I_SessionRequest {
    email: string
    password: string
    rememberMe?: boolean
}

export interface I_SessionResponse {
    accessToken: string
    refreshToken: string
    expiresIn: number
    user: I_UserProfile
}

export interface I_RefreshTokenRequest {
    accessToken: string
}

export interface I_RefreshTokenResponse {
    accessToken: string
    expiresIn: number
}

export interface I_LogoutRequest {
    refreshToken?: string
}

export interface I_LogoutResponse {
    message: string
}

export type T_TwoFactorMethod = 'totp' | 'sms' | 'email' | 'passkey'

export interface I_TwoFactorSetup {
    method: T_TwoFactorMethod
    secret?: string
    backupCodes?: string[]
    qrCode?: string
}

export interface I_TwoFactorVerify {
    code: string
    method: T_TwoFactorMethod
}

export interface I_SessionMetadata {
    deviceName?: string
    deviceType?: 'mobile' | 'tablet' | 'desktop' | 'console'
    os?: string
    browser?: string
    lastActivity: T_Timestamp
}
