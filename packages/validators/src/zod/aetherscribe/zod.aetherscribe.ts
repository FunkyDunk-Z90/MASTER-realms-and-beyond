import { z } from 'zod'
import { Z_ObjectId, Z_Timestamp } from '../zod.common'
import {
    Z_SubscriptionPlan,
    Z_SubscriptionStatus,
    Z_SubscriptionLimits,
} from '../zod.subscription'
import type { T_SubscriptionLimits } from '../zod.subscription'

// ─── Relationship Enums ───────────────────────────────────────────────────────

export const Z_RelationType = z.enum([
    'ally',
    'enemy',
    'rival',
    'friend',
    'lover',
    'family',
    'mentor',
    'student',
    'leader',
    'subordinate',
    'owns',
    'owned_by',
    'carries',
    'wielded_by',
    'located_in',
    'contains',
    'borders',
    'connected_to',
    'member_of',
    'leads',
    'allied_with',
    'opposed_to',
    'vassal_of',
    'overlord_of',
    'worships',
    'priesthood_of',
    'opposed_belief',
    'caused_by',
    'resulted_in',
    'influenced_by',
    'influences',
    'custom',
])

export const Z_RelationshipStrength = z.number().int().min(1).max(10)

// ─── Cross-entity Relationship ────────────────────────────────────────────────

export const Z_Relationship = z.object({
    id: Z_ObjectId,
    codexId: Z_ObjectId,
    fromEntityId: Z_ObjectId,
    fromEntityCategory: z.string(),
    toEntityId: Z_ObjectId,
    toEntityCategory: z.string(),
    type: Z_RelationType,
    customLabel: z.string().optional(),
    description: z.string().optional(),
    isDirectional: z.boolean(),
    strength: Z_RelationshipStrength,
    metadata: z
        .object({
            since: Z_Timestamp.optional(),
            until: Z_Timestamp.optional(),
            status: z
                .enum(['active', 'dormant', 'broken', 'resolved'])
                .optional(),
            publicKnowledge: z.boolean(),
            secretDetails: z.string().optional(),
        })
        .optional(),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

export const Z_CreateRelationshipRequest = z.object({
    codexId: Z_ObjectId,
    fromEntityId: Z_ObjectId,
    fromEntityCategory: z.string(),
    toEntityId: Z_ObjectId,
    toEntityCategory: z.string(),
    type: Z_RelationType,
    customLabel: z.string().optional(),
    description: z.string().optional(),
    isDirectional: z.boolean().optional(),
    strength: Z_RelationshipStrength.optional(),
    metadata: z
        .object({
            since: Z_Timestamp.optional(),
            until: Z_Timestamp.optional(),
            status: z
                .enum(['active', 'dormant', 'broken', 'resolved'])
                .optional(),
            publicKnowledge: z.boolean().optional(),
            secretDetails: z.string().optional(),
        })
        .optional(),
})

export const Z_UpdateRelationshipRequest = z.object({
    type: Z_RelationType.optional(),
    customLabel: z.string().optional(),
    description: z.string().optional(),
    isDirectional: z.boolean().optional(),
    strength: Z_RelationshipStrength.optional(),
    metadata: z
        .object({
            since: Z_Timestamp.optional(),
            until: Z_Timestamp.optional(),
            status: z
                .enum(['active', 'dormant', 'broken', 'resolved'])
                .optional(),
            publicKnowledge: z.boolean().optional(),
            secretDetails: z.string().optional(),
        })
        .optional(),
})

// ─── Aetherscribe Account ─────────────────────────────────────────────────────

export const Z_AetherscribeUsername = z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(20, 'Username must be at most 20 characters.')
    .regex(
        /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/,
        'Username may only contain letters, numbers, underscores, and hyphens, and must start and end with a letter or number.'
    )
    .refine(
        (v) => !/[_-]{2}/.test(v),
        'Username cannot contain consecutive hyphens or underscores.'
    )

export const Z_AetherscribeSubscriptionDoc = z.object({
    plan: Z_SubscriptionPlan,
    status: Z_SubscriptionStatus,
    startDate: z.string(),
    limits: Z_SubscriptionLimits,
})

export const Z_AetherscribeAccount = z.object({
    id: Z_ObjectId,
    identityId: Z_ObjectId,
    username: z.string(),
    subscription: Z_AetherscribeSubscriptionDoc,
    status: z.enum(['active', 'banned']),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

export const Z_CreateAetherscribeAccount = z.object({
    username: Z_AetherscribeUsername,
    plan: Z_SubscriptionPlan,
    firstCodexName: z
        .string()
        .min(1, 'Codex name is required')
        .max(80)
        .optional(),
})

export const Z_UpdateAetherscribeAccount = z.object({
    plan: Z_SubscriptionPlan.optional(),
})

export const Z_ExportCodexRequest = z.object({
    codexId: Z_ObjectId,
    format: z.enum(['json', 'markdown']),
    options: z
        .object({
            includePrivate: z.boolean(),
            includeNotes: z.boolean(),
        })
        .optional(),
})

// ─── Subscription plan limits map ─────────────────────────────────────────────
// -1 = unlimited

export const SUBSCRIPTION_LIMITS: Record<
    z.infer<typeof Z_SubscriptionPlan>,
    T_SubscriptionLimits
> = {
    free: {
        maxCodices: 1,
        maxCharacters: 10,
        maxStorageGB: 1,
        maxCollaborators: 0,
        advancedFeatures: false,
        apiAccess: false,
        customDomain: false,
        prioritySupport: false,
    },
    starter: {
        maxCodices: 5,
        maxCharacters: 50,
        maxStorageGB: 5,
        maxCollaborators: 3,
        advancedFeatures: false,
        apiAccess: false,
        customDomain: false,
        prioritySupport: false,
    },
    pro: {
        maxCodices: -1,
        maxCharacters: -1,
        maxStorageGB: 20,
        maxCollaborators: 10,
        advancedFeatures: true,
        apiAccess: true,
        customDomain: false,
        prioritySupport: false,
    },
    enterprise: {
        maxCodices: -1,
        maxCharacters: -1,
        maxStorageGB: 100,
        maxCollaborators: -1,
        advancedFeatures: true,
        apiAccess: true,
        customDomain: true,
        prioritySupport: true,
    },
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_RelationType = z.infer<typeof Z_RelationType>
export type T_RelationshipStrength = z.infer<typeof Z_RelationshipStrength>
export type T_Relationship = z.infer<typeof Z_Relationship>
export type T_CreateRelationshipRequest = z.infer<
    typeof Z_CreateRelationshipRequest
>
export type T_UpdateRelationshipRequest = z.infer<
    typeof Z_UpdateRelationshipRequest
>
export type T_AetherscribeSubscriptionDoc = z.infer<
    typeof Z_AetherscribeSubscriptionDoc
>
export type T_AetherscribeAccount = z.infer<typeof Z_AetherscribeAccount>
export type T_CreateAetherscribeAccount = z.infer<
    typeof Z_CreateAetherscribeAccount
>
export type T_UpdateAetherscribeAccount = z.infer<
    typeof Z_UpdateAetherscribeAccount
>
export type T_ExportCodexRequest = z.infer<typeof Z_ExportCodexRequest>
