import { z } from 'zod'
import { Z_ObjectId, Z_Timestamp } from './zod.common'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Z_UserRole = z.enum([
    'user',
    'admin',
    'executive-admin',
    'junior-developer',
    'senior-developer',
    'executive-developer',
    'support',
])

export const Z_AccountStatus = z.enum([
    'active',
    'suspended',
    'deleted',
    'pending_verification',
])

export const Z_RnBApp = z.enum(['aetherscribe', 'byteburger', 'nexusserve'])

// ─── App Access ───────────────────────────────────────────────────────────────

export const Z_AppAccess = z.object({
    app: Z_RnBApp,
    linkedAt: Z_Timestamp,
    lastAccessedAt: Z_Timestamp.optional(),
})

// ─── Per-App Profiles ─────────────────────────────────────────────────────────

export const Z_AetherScribeProfile = z.object({
    id: Z_ObjectId,
    userId: Z_ObjectId,
    displayName: z.string().optional(),
    worldCount: z.number(),
    entityCount: z.number(),
    preferences: z
        .object({
            defaultRuleset: z
                .enum(['generic', 'dnd_5e_24', 'aetherscape'])
                .optional(),
            showPrivateEntities: z.boolean(),
        })
        .optional(),
})

export const Z_ByteBurgerProfile = z.object({
    userId: Z_ObjectId,
    loyaltyAccountId: Z_ObjectId.optional(),
    savedAddresses: z
        .array(
            z.object({
                id: z.string(),
                label: z.string(),
                street: z.string(),
                city: z.string(),
                state: z.string(),
                zip: z.string(),
                isDefault: z.boolean(),
            })
        )
        .optional(),
    savedPaymentMethodIds: z.array(Z_ObjectId).optional(),
    orderCount: z.number(),
    lastOrderAt: Z_Timestamp.optional(),
})

export const Z_NexusServeProfile = z.object({
    userId: Z_ObjectId,
    companyId: Z_ObjectId,
    employeeId: Z_ObjectId.optional(),
    role: z.enum(['staff', 'manager', 'admin']),
    permissions: z.array(z.string()).optional(),
})

// ─── Preferences ──────────────────────────────────────────────────────────────

export const Z_UserPreferences = z.object({
    language: z.string(),
    timezone: z.string(),
    theme: z.enum(['light', 'dark', 'system']),
    notifications: z.object({
        email: z.boolean(),
        inApp: z.boolean(),
        sms: z.boolean(),
    }),
})

// ─── Core User & Account ──────────────────────────────────────────────────────

export const Z_User = z.object({
    id: Z_ObjectId,
    email: z.email(),
    firstName: z.string(),
    lastName: z.string(),
    avatar: z.string().optional(),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

export const Z_RnBAccount = Z_User.extend({
    role: Z_UserRole,
    status: Z_AccountStatus,
    emailVerified: z.boolean(),
    twoFactorEnabled: z.boolean(),
    apps: z.array(Z_AppAccess),
    preferences: Z_UserPreferences,
    lastLoginAt: Z_Timestamp.optional(),
})

// ─── Update Requests ──────────────────────────────────────────────────────────

export const Z_UpdateUserRequest = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatar: z.string().optional(),
    preferences: Z_UserPreferences.partial().optional(),
})

export const Z_LinkAppRequest = z.object({
    app: Z_RnBApp,
})

export const Z_UnlinkAppRequest = z.object({
    app: Z_RnBApp,
})

export const Z_UpdateAetherScribeProfileRequest = z.object({
    displayName: z.string().optional(),
    preferences: z
        .object({
            defaultRuleset: z
                .enum(['generic', 'dnd_5e_24', 'aetherscape'])
                .optional(),
            showPrivateEntities: z.boolean().optional(),
        })
        .optional(),
})

export const Z_UpdateNexusServeProfileRequest = z.object({
    companyId: Z_ObjectId.optional(),
    role: z.enum(['staff', 'manager', 'admin']).optional(),
})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type T_UserRole = z.infer<typeof Z_UserRole>
export type T_AccountStatus = z.infer<typeof Z_AccountStatus>
export type T_RnBApp = z.infer<typeof Z_RnBApp>
export type T_AppAccess = z.infer<typeof Z_AppAccess>
export type T_AetherScribeProfile = z.infer<typeof Z_AetherScribeProfile>
export type T_ByteBurgerProfile = z.infer<typeof Z_ByteBurgerProfile>
export type T_NexusServeProfile = z.infer<typeof Z_NexusServeProfile>
export type T_UserPreferences = z.infer<typeof Z_UserPreferences>
export type T_User = z.infer<typeof Z_User>
export type T_RnBAccount = z.infer<typeof Z_RnBAccount>
export type T_UserProfile = T_RnBAccount
export type T_UpdateUserRequest = z.infer<typeof Z_UpdateUserRequest>
export type T_LinkAppRequest = z.infer<typeof Z_LinkAppRequest>
export type T_UnlinkAppRequest = z.infer<typeof Z_UnlinkAppRequest>
export type T_UpdateAetherScribeProfileRequest = z.infer<
    typeof Z_UpdateAetherScribeProfileRequest
>
export type T_UpdateNexusServeProfileRequest = z.infer<
    typeof Z_UpdateNexusServeProfileRequest
>
