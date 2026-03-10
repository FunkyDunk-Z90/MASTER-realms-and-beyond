/**
 * @rnb/types - Identity User Types
 * Core Realms & Beyond account — umbrella identity for all RnB apps.
 * One account, one login, access to all products (AetherScribe, ByteBurger, NexusServe).
 */

import type { T_ObjectId, T_Timestamp, I_User } from '../global/common/commonIndex'

// ============================================================================
// PLATFORM ROLES & STATUS
// ============================================================================

export type T_UserRole = 'user' | 'admin' | 'developer' | 'support'

export type T_AccountStatus =
    | 'active'
    | 'suspended'
    | 'deleted'
    | 'pending_verification'

// ============================================================================
// RNB APPS
// ============================================================================

/** All products that live under the Realms & Beyond umbrella */
export type T_RnBApp = 'aetherscribe' | 'byteburger' | 'nexusserve'

/** Records which RnB apps a user has connected to their account */
export interface I_AppAccess {
    app: T_RnBApp
    linkedAt: T_Timestamp
    lastAccessedAt?: T_Timestamp
}

// ============================================================================
// PER-APP PROFILES
// ============================================================================

/** AetherScribe profile — worldbuilding & TTRPG toolkit */
export interface I_AetherScribeProfile {
    userId: T_ObjectId
    displayName?: string
    worldCount: number
    entityCount: number
    preferences?: {
        defaultRuleset?: 'generic' | 'dnd_5e_24' | 'aetherscape'
        showPrivateEntities: boolean
    }
}

/** ByteBurger profile — food ordering & loyalty */
export interface I_ByteBurgerProfile {
    userId: T_ObjectId
    loyaltyAccountId?: T_ObjectId
    savedAddresses?: {
        id: string
        label: string
        street: string
        city: string
        state: string
        zip: string
        isDefault: boolean
    }[]
    savedPaymentMethodIds?: T_ObjectId[]
    orderCount: number
    lastOrderAt?: T_Timestamp
}

/** NexusServe profile — restaurant management & POS */
export interface I_NexusServeProfile {
    userId: T_ObjectId
    companyId: T_ObjectId
    employeeId?: T_ObjectId
    role: 'staff' | 'manager' | 'admin'
    permissions?: string[]
}

// ============================================================================
// CORE RNB ACCOUNT
// ============================================================================

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

/**
 * The Realms & Beyond master account.
 * Single identity — log in once, access all RnB apps.
 */
export interface I_RnBAccount extends I_User {
    role: T_UserRole
    status: T_AccountStatus
    emailVerified: boolean
    twoFactorEnabled: boolean
    /** Apps this user has connected to their RnB account */
    apps: I_AppAccess[]
    preferences: I_UserPreferences
    lastLoginAt?: T_Timestamp
}

/** Alias used in session responses and auth flows */
export type I_UserProfile = I_RnBAccount

// ============================================================================
// UPDATE REQUESTS
// ============================================================================

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

// ============================================================================
// APP PROFILE REQUESTS
// ============================================================================

export interface I_LinkAppRequest {
    app: T_RnBApp
}

export interface I_UnlinkAppRequest {
    app: T_RnBApp
}

export interface I_UpdateAetherScribeProfileRequest {
    displayName?: string
    preferences?: I_AetherScribeProfile['preferences']
}

export interface I_UpdateNexusServeProfileRequest {
    companyId?: T_ObjectId
    role?: I_NexusServeProfile['role']
}
