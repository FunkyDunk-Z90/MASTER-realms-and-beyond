// User/account types derived from Zod schemas in @rnb/validators.

export type {
    T_UserRole,
    T_AccountStatus,
    T_RnBApp,
    T_AppAccess,
    T_AetherScribeProfile,
    T_ByteBurgerProfile,
    T_NexusServeProfile,
    T_UserPreferences,
    T_User,
    T_RnBAccount,
    T_UserProfile,
    T_UpdateUserRequest,
    T_LinkAppRequest,
    T_UnlinkAppRequest,
    T_UpdateAetherScribeProfileRequest,
    T_UpdateNexusServeProfileRequest,
} from '@rnb/validators'

// ─── I_* aliases for backward compatibility ───────────────────────────────────

import type {
    T_AppAccess,
    T_AetherScribeProfile,
    T_ByteBurgerProfile,
    T_NexusServeProfile,
    T_UserPreferences,
    T_User,
    T_RnBAccount,
    T_UpdateUserRequest,
    T_LinkAppRequest,
    T_UnlinkAppRequest,
    T_UpdateAetherScribeProfileRequest,
    T_UpdateNexusServeProfileRequest,
} from '@rnb/validators'

export type I_AppAccess = T_AppAccess
export type I_AetherScribeProfile = T_AetherScribeProfile
export type I_ByteBurgerProfile = T_ByteBurgerProfile
export type I_NexusServeProfile = T_NexusServeProfile
export type I_UserPreferences = T_UserPreferences
export type I_User = T_User
export type I_RnBAccount = T_RnBAccount
export type I_UserProfile = T_RnBAccount
export type I_UpdateUserRequest = T_UpdateUserRequest
export type I_LinkAppRequest = T_LinkAppRequest
export type I_UnlinkAppRequest = T_UnlinkAppRequest
export type I_UpdateAetherScribeProfileRequest = T_UpdateAetherScribeProfileRequest
export type I_UpdateNexusServeProfileRequest = T_UpdateNexusServeProfileRequest
