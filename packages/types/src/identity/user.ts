import { T_ObjectId, T_Timestamp, I_User } from '../global/common/commonIndex'

export type T_UserRole = 'user' | 'admin' | 'developer' | 'support'

export type T_AccountStatus =
    | 'active'
    | 'suspended'
    | 'deleted'
    | 'pending_verification'

export interface I_UserProfile extends I_User {
    role: T_UserRole
    status: T_AccountStatus
    emailVerified: boolean
    twoFactorEnabled: boolean
    lastLoginAt?: T_Timestamp
    preferences: I_UserPreferences
}

export interface I_UserPreferences {
    language: string
    timezone: string
    theme: 'light' | 'dark' | 'system'
    notifications: {
        email: boolean
        inApp: boolean
        sms: boolean
    }
}

export interface I_UpdateUserRequest {
    firstName?: string
    lastName?: string
    avatar?: string
    preferences?: Partial<I_UserPreferences>
}

export interface I_ChangePasswordRequest {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}
