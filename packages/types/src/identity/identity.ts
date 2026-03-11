// All identity types are derived from Zod schemas in @rnb/validators.
// This file re-exports them under both T_* (canonical) and I_* (legacy) names
// so existing imports from '@rnb/types' continue to work unchanged.
// For Zod schemas (runtime values), import directly from '@rnb/validators'.

export type {
    T_IdentityStatus,
    T_TwoFactorMethod,
    T_IdentityProfile,
    T_IdentityMedia,
    T_IdentityPreferences,
    T_IdentityVerification,
    T_IdentitySecurity,
    T_LinkedService,
    T_IdentityAudit,
    T_IdentityLifecycle,
    T_Identity,
    T_Contact,
} from '@rnb/validators'

// ─── I_* aliases for backward compatibility ───────────────────────────────────

import type {
    T_IdentityProfile,
    T_IdentityMedia,
    T_IdentityPreferences,
    T_IdentityVerification,
    T_IdentitySecurity,
    T_LinkedService,
    T_IdentityAudit,
    T_IdentityLifecycle,
    T_Identity,
    T_Contact,
} from '@rnb/validators'

export type I_IdentityProfile = T_IdentityProfile
export type I_IdentityMedia = T_IdentityMedia
export type I_IdentityPreferences = T_IdentityPreferences
export type I_IdentityVerification = T_IdentityVerification
export type I_IdentitySecurity = T_IdentitySecurity
export type I_LinkedServices = T_LinkedService
export type I_IdentityAudit = T_IdentityAudit
export type I_IdentityLifecycle = T_IdentityLifecycle
export type I_Identity = T_Identity
export type I_ContactProps = T_Contact
