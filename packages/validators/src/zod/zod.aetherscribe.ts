import { z } from 'zod'
import { Z_ObjectId, Z_Timestamp } from './zod.common'
import {
    Z_SubscriptionPlan,
    Z_SubscriptionStatus,
    Z_SubscriptionLimits,
} from './zod.subscription'
import type { T_SubscriptionLimits } from './zod.subscription'

// ─── Enums ─────────────────────────────────────────────────────────────────

export const Z_EntityType = z.enum([
    'character',
    'npc',
    'location',
    'item',
    'faction',
    'species',
    'class',
    'background',
    'spell',
    'belief',
    'lore',
    'archetype',
    'origin',
    'gift',
    'artifact',
])

export const Z_Ruleset = z.enum(['generic', 'dnd_5e_24', 'aetherscape'])

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

// ─── Entity ─────────────────────────────────────────────────────────────────

export const Z_BaseEntity = z.object({
    id: Z_ObjectId,
    worldId: Z_ObjectId,
    userId: Z_ObjectId,
    type: Z_EntityType,
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()),
    isPrivate: z.boolean(),
    ruleset: Z_Ruleset,
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
    version: z.number().int(),
})

export const Z_EntityFilter = z.object({
    type: z.union([Z_EntityType, z.array(Z_EntityType)]).optional(),
    ruleset: z.union([Z_Ruleset, z.array(Z_Ruleset)]).optional(),
    tags: z.array(z.string()).optional(),
    isPrivate: z.boolean().optional(),
    createdAfter: Z_Timestamp.optional(),
    createdBefore: Z_Timestamp.optional(),
    userId: Z_ObjectId.optional(),
    search: z.string().optional(),
})

export const Z_EntityRelation = z.object({
    id: Z_ObjectId,
    fromEntityId: Z_ObjectId,
    toEntityId: Z_ObjectId,
    relationshipType: z.string(),
    description: z.string().optional(),
    isDirectional: z.boolean(),
    strength: z.number().int().min(1).max(10).optional(),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

// ─── World ─────────────────────────────────────────────────────────────────

export const Z_WorldVisibility = z.enum(['private', 'friends_only', 'public'])

export const Z_CollaboratorRole = z.enum(['viewer', 'editor', 'admin'])

export const Z_World = z.object({
    id: Z_ObjectId,
    userId: Z_ObjectId,
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    primaryRuleset: Z_Ruleset,
    supportedRulesets: z.array(Z_Ruleset),
    visibility: Z_WorldVisibility,
    tags: z.array(z.string()),
    metadata: z
        .object({
            coverImageUrl: z.string().optional(),
            backgroundColor: z.string().optional(),
            theme: z.string().optional(),
            toneDifficulty: z.enum(['light', 'balanced', 'dark', 'grimdark']).optional(),
        })
        .optional(),
    collaborators: z.array(
        z.object({
            userId: Z_ObjectId,
            role: Z_CollaboratorRole,
            addedAt: Z_Timestamp,
        })
    ),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

export const Z_Campaign = z.object({
    id: Z_ObjectId,
    worldId: Z_ObjectId,
    name: z.string(),
    status: z.enum(['planning', 'active', 'paused', 'completed']),
    participants: z.array(
        z.object({
            userId: Z_ObjectId,
            characterId: Z_ObjectId.optional(),
            role: z.enum(['dm', 'player']),
        })
    ),
    createdAt: Z_Timestamp,
})

export const Z_WorldSection = z.object({
    id: Z_ObjectId,
    worldId: Z_ObjectId,
    name: z.string(),
    parentSectionId: Z_ObjectId.optional(),
    linkedEntities: z.array(Z_ObjectId),
    createdAt: Z_Timestamp,
})

// ─── Relationship ─────────────────────────────────────────────────────────────

export const Z_RelationshipStrength = z.number().int().min(1).max(10)

export const Z_Relationship = z.object({
    id: Z_ObjectId,
    worldId: Z_ObjectId,
    fromEntityId: Z_ObjectId,
    fromEntityType: Z_EntityType,
    toEntityId: Z_ObjectId,
    toEntityType: Z_EntityType,
    type: Z_RelationType,
    customLabel: z.string().optional(),
    description: z.string().optional(),
    isDirectional: z.boolean(),
    reverseRelationshipId: Z_ObjectId.optional(),
    strength: Z_RelationshipStrength,
    ruleset: Z_Ruleset,
    metadata: z
        .object({
            since: Z_Timestamp.optional(),
            until: Z_Timestamp.optional(),
            status: z.enum(['active', 'dormant', 'broken', 'resolved']).optional(),
            publicKnowledge: z.boolean(),
            secretDetails: z.string().optional(),
        })
        .optional(),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

// ─── Request Schemas ─────────────────────────────────────────────────────────────

export const Z_CreateEntityRequest = z.object({
    worldId: Z_ObjectId,
    type: Z_EntityType,
    name: z.string().min(1),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isPrivate: z.boolean().optional(),
    ruleset: Z_Ruleset,
    data: z.record(z.string(), z.any()),
})

export const Z_UpdateEntityRequest = z.object({
    id: Z_ObjectId,
    name: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isPrivate: z.boolean().optional(),
    data: z.record(z.string(), z.any()).optional(),
})

export const Z_BulkDeleteEntityRequest = z.object({
    ids: z.array(Z_ObjectId),
    hardDelete: z.boolean().optional(),
})

export const Z_ListEntitiesRequest = z.object({
    worldId: Z_ObjectId,
    type: z.union([Z_EntityType, z.array(Z_EntityType)]).optional(),
    ruleset: z.union([Z_Ruleset, z.array(Z_Ruleset)]).optional(),
    tags: z.array(z.string()).optional(),
    isPrivate: z.boolean().optional(),
    search: z.string().optional(),
    createdAfter: Z_Timestamp.optional(),
    createdBefore: Z_Timestamp.optional(),
    limit: z.number().int().positive().optional(),
    offset: z.number().int().nonnegative().optional(),
})

export const Z_CreateWorldRequest = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    primaryRuleset: Z_Ruleset,
    supportedRulesets: z.array(Z_Ruleset).optional(),
    visibility: Z_WorldVisibility.optional(),
    tags: z.array(z.string()).optional(),
    metadata: z
        .object({
            coverImageUrl: z.string().optional(),
            backgroundColor: z.string().optional(),
            theme: z.string().optional(),
            toneDifficulty: z.enum(['light', 'balanced', 'dark', 'grimdark']).optional(),
        })
        .optional(),
})

export const Z_UpdateWorldRequest = Z_CreateWorldRequest.partial().extend({ id: Z_ObjectId })

export const Z_AddCollaboratorRequest = z.object({
    worldId: Z_ObjectId,
    userId: Z_ObjectId,
    role: Z_CollaboratorRole,
})

export const Z_CreateRelationshipRequest = z.object({
    worldId: Z_ObjectId,
    fromEntityId: Z_ObjectId,
    toEntityId: Z_ObjectId,
    type: Z_RelationType,
    customLabel: z.string().optional(),
    description: z.string().optional(),
    isDirectional: z.boolean().optional(),
    strength: Z_RelationshipStrength.optional(),
    metadata: z
        .object({
            since: Z_Timestamp.optional(),
            until: Z_Timestamp.optional(),
            status: z.enum(['active', 'dormant', 'broken', 'resolved']).optional(),
            publicKnowledge: z.boolean().optional(),
            secretDetails: z.string().optional(),
        })
        .optional(),
})

export const Z_CreateCampaignRequest = z.object({
    worldId: Z_ObjectId,
    name: z.string().min(1),
    description: z.string().optional(),
    participants: z
        .array(
            z.object({
                userId: Z_ObjectId,
                role: z.enum(['dm', 'player']),
                characterId: Z_ObjectId.optional(),
            })
        )
        .optional(),
})

export const Z_SearchEntitiesRequest = z.object({
    worldId: Z_ObjectId,
    query: z.string(),
    entityTypes: z.array(Z_EntityType).optional(),
    limit: z.number().int().positive().optional(),
    offset: z.number().int().nonnegative().optional(),
    includeRelationships: z.boolean().optional(),
})

export const Z_ExportWorldRequest = z.object({
    worldId: Z_ObjectId,
    format: z.enum(['json', 'compressed', 'markdown']),
    options: z
        .object({
            includeImages: z.boolean(),
            includeNotes: z.boolean(),
            includePrivate: z.boolean(),
            includeCollaborators: z.boolean(),
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
})

// ─── Subscription plan limits map ─────────────────────────────────────────────
// Defines per-plan resource limits. -1 = unlimited.

export const SUBSCRIPTION_LIMITS: Record<
    z.infer<typeof Z_SubscriptionPlan>,
    T_SubscriptionLimits
> = {
    free: {
        maxWorlds: 1,
        maxCharacters: 10,
        maxStorageGB: 1,
        maxCollaborators: 0,
        advancedFeatures: false,
        apiAccess: false,
        customDomain: false,
        prioritySupport: false,
    },
    starter: {
        maxWorlds: 5,
        maxCharacters: 50,
        maxStorageGB: 5,
        maxCollaborators: 3,
        advancedFeatures: false,
        apiAccess: false,
        customDomain: false,
        prioritySupport: false,
    },
    pro: {
        maxWorlds: -1,
        maxCharacters: -1,
        maxStorageGB: 20,
        maxCollaborators: 10,
        advancedFeatures: true,
        apiAccess: true,
        customDomain: false,
        prioritySupport: false,
    },
    enterprise: {
        maxWorlds: -1,
        maxCharacters: -1,
        maxStorageGB: 100,
        maxCollaborators: -1,
        advancedFeatures: true,
        apiAccess: true,
        customDomain: true,
        prioritySupport: true,
    },
}

export type T_AetherscribeSubscriptionDoc = z.infer<
    typeof Z_AetherscribeSubscriptionDoc
>
export type T_AetherscribeAccount = z.infer<typeof Z_AetherscribeAccount>
export type T_CreateAetherscribeAccount = z.infer<
    typeof Z_CreateAetherscribeAccount
>

// ─── Inferred Types ─────────────────────────────────────────────────────────────

export type T_EntityType = z.infer<typeof Z_EntityType>
export type T_Ruleset = z.infer<typeof Z_Ruleset>
export type T_RelationType = z.infer<typeof Z_RelationType>
export type T_BaseEntity = z.infer<typeof Z_BaseEntity>
export type T_EntityFilter = z.infer<typeof Z_EntityFilter>
export type T_EntityRelation = z.infer<typeof Z_EntityRelation>
export type T_WorldVisibility = z.infer<typeof Z_WorldVisibility>
export type T_CollaboratorRole = z.infer<typeof Z_CollaboratorRole>
export type T_World = z.infer<typeof Z_World>
export type T_Campaign = z.infer<typeof Z_Campaign>
export type T_WorldSection = z.infer<typeof Z_WorldSection>
export type T_RelationshipStrength = z.infer<typeof Z_RelationshipStrength>
export type T_Relationship = z.infer<typeof Z_Relationship>
export type T_CreateEntityRequest = z.infer<typeof Z_CreateEntityRequest>
export type T_UpdateEntityRequest = z.infer<typeof Z_UpdateEntityRequest>
export type T_BulkDeleteEntityRequest = z.infer<typeof Z_BulkDeleteEntityRequest>
export type T_ListEntitiesRequest = z.infer<typeof Z_ListEntitiesRequest>
export type T_CreateWorldRequest = z.infer<typeof Z_CreateWorldRequest>
export type T_UpdateWorldRequest = z.infer<typeof Z_UpdateWorldRequest>
export type T_AddCollaboratorRequest = z.infer<typeof Z_AddCollaboratorRequest>
export type T_CreateRelationshipRequest = z.infer<typeof Z_CreateRelationshipRequest>
export type T_CreateCampaignRequest = z.infer<typeof Z_CreateCampaignRequest>
export type T_SearchEntitiesRequest = z.infer<typeof Z_SearchEntitiesRequest>
export type T_ExportWorldRequest = z.infer<typeof Z_ExportWorldRequest>
