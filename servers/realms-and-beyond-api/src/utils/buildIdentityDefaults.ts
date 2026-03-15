import { Request } from 'express'
import { T_IdentityProfile } from '@rnb/validators'

interface I_BuildIdentityDefaultsInput {
    profile: T_IdentityProfile
    req: Request
}

export const buildIdentityDefaults = ({
    profile,
    req,
}: I_BuildIdentityDefaultsInput) => {
    // Infer language from Accept-Language header, fall back to 'en'
    const acceptLanguage = req.headers['accept-language']
    const language = acceptLanguage
        ? acceptLanguage.split(',')[0].split('-')[0].trim()
        : 'en'

    // Infer timezone from custom header if set by client, fall back to UTC
    const timezone = (req.headers['x-timezone'] as string | undefined) ?? 'UTC'

    return {
        profile,
        security: {
            trustedDevices: [],
        },
        preferences: {
            language,
            timezone,
            theme: 'system' as const,
        },
        verification: {
            emailVerified: false,
            phoneVerified: false,
            identityVerified: false,
            twoFactorEnabled: false,
        },
        lifecycle: {
            status: 'active' as const,
        },
        audit: {
            marketingConsent: false,
        },
    }
}
