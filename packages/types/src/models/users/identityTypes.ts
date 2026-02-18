import { T_ObjectId, T_Timestamp } from '../../globalTypes'
import { I_ContactProps } from './personalData/contactTypes'
import { I_GenderIdentity, I_Pronouns } from './personalData/genderTypes'

export type T_IdentityStatus = 'active' | 'soft-deleted' | 'banned'

export interface I_IdentityPreferences {
    language: string
    timezone: string
    currency?: string
    dateFormat?: string
    theme?: 'light' | 'dark' | 'system'
}

export interface I_IdentityVerification {
    emailVerified: boolean
    phoneVerified: boolean
    identityVerified?: boolean
    verifiedAt?: T_Timestamp
    twoFactorEnabled: boolean
    twoFactorMethod?: 'totp' | 'sms' | 'email' | 'passkey'
}

export interface I_IdentityMedia {
    avatarUrl?: string
    bannerUrl?: string
    avatarUpdatedAt?: T_Timestamp
}

export interface I_IdentitySecurity {
    passwordHash?: string
    passwordConfirmHash?: string
    passwordChangedAt?: T_Timestamp
    passwordResetToken?: string
    passwordResetExpiresIn?: T_Timestamp
    emailVerificationToken?: string
    emailVerificationExpiresIn?: T_Timestamp
    lastKnownIp?: string
    trustedDevices?: T_ObjectId[]
    recoveryEmail?: string
    recoveryPhone?: string
}

export interface I_IdentityAccountRelations {
    linkedAccounts?: T_ObjectId
    parentIdentity?: T_ObjectId
    managedIdentities?: T_ObjectId[]
}

export interface I_IdentityAudit {
    termsAcceptedAt?: T_Timestamp
    termsVersion?: string
    privacyAcceptedAt?: T_Timestamp
    marketingConsent: boolean
    dataResidency: string
    deletionRequestedAt?: T_Timestamp
}

export interface I_IdentityLifecycle {
    status: T_IdentityStatus
    deletedAt?: T_Timestamp
    recoverableUntil?: T_Timestamp
}

export interface I_IdentityProfile {
    firstName: string
    lastName: string
    dateOfBirth?: string
    nationality?: string
    gender?: I_GenderIdentity
    pronouns?: I_Pronouns
}

export interface I_Identity {
    id: T_ObjectId
    profile: I_IdentityProfile
    media: I_IdentityMedia
    contact: I_ContactProps
    preferences: I_IdentityPreferences
    verification: I_IdentityVerification
    security: I_IdentitySecurity
    accounts: I_IdentityAccountRelations
    audit: I_IdentityAudit
    lifecycle: I_IdentityLifecycle
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
    lastLoginAt?: T_Timestamp
    aetherscribeAccount: T_ObjectId
}
