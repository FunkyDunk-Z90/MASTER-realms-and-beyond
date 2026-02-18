import { Request } from 'express'
import { I_IdentityProfile, I_ContactProps, T_IdentityStatus } from '@rnb/types'

interface I_BuildIdentityDefaultsParams {
    profile: I_IdentityProfile
    contact: I_ContactProps
    password: string
    req: Request
}

export const buildIdentityDefaults = ({
    profile,
    contact,
    password,
    req,
}: I_BuildIdentityDefaultsParams) => ({
    profile,
    contact,
    security: {
        passwordHash: password,
        lastKnownIp: req.ip,
        trustedDevices: [],
    },
    verification: {
        emailVerified: false,
        phoneVerified: false,
        identityVerified: false,
        twoFactorEnabled: false,
    },
    preferences: {
        language: req.headers['accept-language']?.split(',')[0] ?? 'en-US',
        timezone: 'UTC',
        theme: 'system',
    },
    lifecycle: {
        status: 'active' as T_IdentityStatus,
    },
    audit: {
        marketingConsent: false,
    },
    accounts: {
        linkedAccounts: [],
        managedIdentities: [],
    },
    media: {},
    lastLoginAt: new Date(),
})
