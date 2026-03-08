/**
 * @rnb/types - AetherScribe Request Types
 * Complete request/response types for entities, worlds, campaigns, and relationships
 */

import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'
import type { E_EntityType, E_Ruleset } from './entity'
import type { E_RelationType, RelationshipStrength } from './relationship'
import type { I_World, I_WorldStats } from './world'
import type { I_ErrorResponse } from '../global/errors'
import type { I_ApiSuccess } from '../global/api-responses'

// ============================================================================
// ENTITY CREATION REQUESTS
// ============================================================================

export interface I_CreateEntityRequest {
    worldId: T_ObjectId
    type: E_EntityType
    name: string
    description?: string
    tags?: string[]
    isPrivate?: boolean
    ruleset: E_Ruleset
    data: Record<string, any>
}

export interface I_CreateCharacterRequest extends I_CreateEntityRequest {
    type: 'character'
}

export interface I_CreateNPCRequest extends I_CreateEntityRequest {
    type: 'npc'
}

export interface I_CreateLocationRequest extends I_CreateEntityRequest {
    type: 'location'
}

export interface I_CreateItemRequest extends I_CreateEntityRequest {
    type: 'item'
}

export interface I_CreateFactionRequest extends I_CreateEntityRequest {
    type: 'faction'
}

export interface I_CreateSpellRequest extends I_CreateEntityRequest {
    type: 'spell'
    ruleset: 'dnd_5e_24'
}

export interface I_CreateBeliefRequest extends I_CreateEntityRequest {
    type: 'belief'
}

export interface I_CreateLoreRequest extends I_CreateEntityRequest {
    type: 'lore'
}

// ============================================================================
// ENTITY UPDATE REQUESTS
// ============================================================================

export interface I_UpdateEntityRequest {
    id: T_ObjectId
    name?: string
    description?: string
    tags?: string[]
    isPrivate?: boolean
    data?: Record<string, any>
}

export interface I_BulkUpdateEntityRequest {
    ids: T_ObjectId[]
    updates: Partial<I_UpdateEntityRequest>
}

export interface I_BulkDeleteEntityRequest {
    ids: T_ObjectId[]
    hardDelete?: boolean
}

// ============================================================================
// ENTITY QUERY REQUESTS
// ============================================================================

export interface I_ListEntitiesRequest {
    worldId: T_ObjectId
    type?: E_EntityType | E_EntityType[]
    ruleset?: E_Ruleset | E_Ruleset[]
    tags?: string[]
    isPrivate?: boolean
    search?: string
    createdAfter?: T_Timestamp
    createdBefore?: T_Timestamp
    limit?: number
    offset?: number
}

export interface I_GetEntityRequest {
    id: T_ObjectId
    includeRelationships?: boolean
    includeMetadata?: boolean
}

export interface I_DeleteEntityRequest {
    id: T_ObjectId
    includeRelated?: boolean
    hardDelete?: boolean
}

// ============================================================================
// WORLD REQUESTS
// ============================================================================

export interface I_CreateWorldRequest {
    name: string
    description?: string
    primaryRuleset: E_Ruleset
    supportedRulesets?: E_Ruleset[]
    visibility?: 'private' | 'friends_only' | 'public'
    tags?: string[]
    metadata?: {
        coverImageUrl?: string
        backgroundColor?: string
        theme?: string
        toneDifficulty?: 'light' | 'balanced' | 'dark' | 'grimdark'
    }
}

export interface I_UpdateWorldRequest {
    id: T_ObjectId
    name?: string
    description?: string
    visibility?: 'private' | 'friends_only' | 'public'
    tags?: string[]
    metadata?: {
        coverImageUrl?: string
        backgroundColor?: string
        theme?: string
        toneDifficulty?: 'light' | 'balanced' | 'dark' | 'grimdark'
    }
}

export interface I_DeleteWorldRequest {
    id: T_ObjectId
    hardDelete?: boolean
}

export interface I_GetWorldRequest {
    id: T_ObjectId
    includeStats?: boolean
    includeCampaigns?: boolean
    includeSections?: boolean
}

// ============================================================================
// WORLD STATISTICS REQUESTS
// ============================================================================

export interface I_GetWorldStatsRequest {
    worldId: T_ObjectId
    includeRulesetBreakdown?: boolean
    includeDetailedStats?: boolean
    includeContentCoverage?: boolean
    includeRelationships?: boolean
    onlyRulesets?: E_Ruleset[]
}

export interface I_UpdateWorldStatsRequest {
    worldId: T_ObjectId
    recalculateFromEntities?: boolean
}

export interface I_RecalculateWorldStatsRequest {
    worldId: T_ObjectId
}

// ============================================================================
// COLLABORATION REQUESTS
// ============================================================================

export interface I_AddCollaboratorRequest {
    worldId: T_ObjectId
    userId: T_ObjectId
    role: 'viewer' | 'editor' | 'admin'
}

export interface I_UpdateCollaboratorRequest {
    worldId: T_ObjectId
    userId: T_ObjectId
    role: 'viewer' | 'editor' | 'admin'
}

export interface I_RemoveCollaboratorRequest {
    worldId: T_ObjectId
    userId: T_ObjectId
}

// ============================================================================
// CAMPAIGN REQUESTS
// ============================================================================

export interface I_CreateCampaignRequest {
    worldId: T_ObjectId
    name: string
    description?: string
    participants?: {
        userId: T_ObjectId
        role: 'dm' | 'player'
        characterId?: T_ObjectId
    }[]
}

export interface I_UpdateCampaignRequest {
    id: T_ObjectId
    name?: string
    description?: string
    status?: 'planning' | 'active' | 'paused' | 'completed'
}

export interface I_DeleteCampaignRequest {
    id: T_ObjectId
}

export interface I_AddCampaignParticipantRequest {
    campaignId: T_ObjectId
    userId: T_ObjectId
    role: 'dm' | 'player'
    characterId?: T_ObjectId
}

export interface I_RemoveCampaignParticipantRequest {
    campaignId: T_ObjectId
    userId: T_ObjectId
}

export interface I_LogCampaignSessionRequest {
    campaignId: T_ObjectId
    sessionNumber: number
    summary: string
    date?: T_Timestamp
}

// ============================================================================
// WORLD SECTION REQUESTS
// ============================================================================

export interface I_CreateWorldSectionRequest {
    worldId: T_ObjectId
    name: string
    description?: string
    parentSectionId?: T_ObjectId
    linkedEntities?: T_ObjectId[]
}

export interface I_UpdateWorldSectionRequest {
    id: T_ObjectId
    name?: string
    description?: string
    parentSectionId?: T_ObjectId
}

export interface I_DeleteWorldSectionRequest {
    id: T_ObjectId
}

export interface I_AddEntityToSectionRequest {
    sectionId: T_ObjectId
    entityId: T_ObjectId
    order?: number
}

export interface I_RemoveEntityFromSectionRequest {
    sectionId: T_ObjectId
    entityId: T_ObjectId
}

// ============================================================================
// RELATIONSHIP REQUESTS
// ============================================================================

export interface I_CreateRelationshipRequest {
    worldId: T_ObjectId
    fromEntityId: T_ObjectId
    toEntityId: T_ObjectId
    type: E_RelationType
    customLabel?: string
    description?: string
    isDirectional?: boolean
    strength?: RelationshipStrength
    metadata?: {
        since?: T_Timestamp
        until?: T_Timestamp
        status?: 'active' | 'dormant' | 'broken' | 'resolved'
        publicKnowledge?: boolean
        secretDetails?: string
        [key: string]: any
    }
}

export interface I_UpdateRelationshipRequest {
    id: T_ObjectId
    type?: E_RelationType
    customLabel?: string
    description?: string
    strength?: RelationshipStrength
    metadata?: {
        since?: T_Timestamp
        until?: T_Timestamp
        status?: 'active' | 'dormant' | 'broken' | 'resolved'
        publicKnowledge?: boolean
        secretDetails?: string
        [key: string]: any
    }
}

export interface I_DeleteRelationshipRequest {
    id: T_ObjectId
    deleteReverse?: boolean
}

export interface I_ListRelationshipsRequest {
    worldId: T_ObjectId
    fromEntityId?: T_ObjectId
    toEntityId?: T_ObjectId
    type?: E_RelationType | E_RelationType[]
    minStrength?: RelationshipStrength
    isDirectional?: boolean
    limit?: number
    offset?: number
}

export interface I_GetRelationshipNetworkRequest {
    worldId: T_ObjectId
    entityId: T_ObjectId
    depth?: 1 | 2 | 3
    includeStats?: boolean
}

export interface I_BulkCreateRelationshipRequest {
    worldId: T_ObjectId
    relationships: Omit<I_CreateRelationshipRequest, 'worldId'>[]
}

export interface I_BulkDeleteRelationshipRequest {
    ids: T_ObjectId[]
    deleteReverse?: boolean
}

// ============================================================================
// GENERIC RESPONSES
// ============================================================================

export type I_SuccessResponse<T> = I_ApiSuccess<T>

export type T_Response<T> = I_ApiSuccess<T> | I_ErrorResponse

// ============================================================================
// LIST RESPONSES
// ============================================================================

export interface I_ListResponse<T> {
    success: true
    data: T[]
    pagination: {
        total: number
        limit: number
        offset: number
        hasMore: boolean
    }
    timestamp: string
    requestId: string
}

// ============================================================================
// BULK OPERATION RESPONSES
// ============================================================================

export interface I_BulkOperationResponse {
    success: boolean
    processed: number
    succeeded: number
    failed: number
    results: {
        id?: T_ObjectId
        success: boolean
        message?: string
    }[]
    timestamp: string
    requestId: string
}

// ============================================================================
// SPECIFIC ENTITY RESPONSES
// ============================================================================

export interface I_EntityResponse {
    success: boolean
    data?: any
    error?: {
        code: string
        message: string
        details?: any
    }
    timestamp: string
    requestId: string
}

export interface I_EntityListResponse {
    success: boolean
    data: any[]
    pagination: {
        total: number
        limit: number
        offset: number
        hasMore: boolean
    }
    timestamp: string
    requestId: string
}

// ============================================================================
// WORLD RESPONSES
// ============================================================================

export interface I_WorldResponse {
    success: boolean
    data?: I_World
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

export interface I_WorldListResponse {
    success: boolean
    data: I_World[]
    pagination: {
        total: number
        limit: number
        offset: number
        hasMore: boolean
    }
    timestamp: string
    requestId: string
}

export interface I_WorldStatsResponse {
    success: boolean
    data?: I_WorldStats
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

// ============================================================================
// COLLABORATION RESPONSES
// ============================================================================

export interface I_CollaboratorResponse {
    success: boolean
    data?: {
        userId: T_ObjectId
        role: 'viewer' | 'editor' | 'admin'
        addedAt: T_Timestamp
    }
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

export interface I_CollaboratorListResponse {
    success: boolean
    data: {
        userId: T_ObjectId
        role: 'viewer' | 'editor' | 'admin'
        addedAt: T_Timestamp
    }[]
    timestamp: string
    requestId: string
}

// ============================================================================
// RELATIONSHIP RESPONSES
// ============================================================================

export interface I_RelationshipResponse {
    success: boolean
    data?: any
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

export interface I_RelationshipListResponse {
    success: boolean
    data: any[]
    pagination: {
        total: number
        limit: number
        offset: number
        hasMore: boolean
    }
    timestamp: string
    requestId: string
}

export interface I_RelationshipNetworkResponse {
    success: boolean
    data?: {
        entityId: T_ObjectId
        outgoing: any[]
        incoming: any[]
        connections: {
            directly: { count: number; types: Record<string, number> }
            twoDegreesAway: { count: number; types: Record<string, number> }
            threeDegrees: { count: number }
        }
    }
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

// ============================================================================
// CAMPAIGN RESPONSES
// ============================================================================

export interface I_CampaignResponse {
    success: boolean
    data?: any
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

export interface I_CampaignListResponse {
    success: boolean
    data: any[]
    pagination: {
        total: number
        limit: number
        offset: number
        hasMore: boolean
    }
    timestamp: string
    requestId: string
}

// ============================================================================
// EXPORT/IMPORT REQUESTS
// ============================================================================

export interface I_ExportWorldRequest {
    worldId: T_ObjectId
    format: 'json' | 'compressed' | 'markdown'
    options?: {
        includeImages: boolean
        includeNotes: boolean
        includePrivate: boolean
        includeCollaborators: boolean
    }
}

export interface I_ImportWorldRequest {
    name: string
    visibility: 'private' | 'friends_only' | 'public'
    data: Record<string, any>
    options?: {
        overwriteExisting: boolean
        mergeRulesets: boolean
        importCampaigns: boolean
        importSections: boolean
    }
}

export interface I_ExportResponse {
    success: boolean
    downloadUrl?: string
    expiresAt?: T_Timestamp
    error?: {
        code: string
        message: string
    }
    timestamp: string
    requestId: string
}

// ============================================================================
// BATCH/UTILITY REQUESTS
// ============================================================================

export interface I_SearchEntitiesRequest {
    worldId: T_ObjectId
    query: string
    entityTypes?: E_EntityType[]
    limit?: number
    offset?: number
    includeRelationships?: boolean
}

export interface I_SearchEntitiesResponse {
    success: boolean
    data: {
        entityId: T_ObjectId
        entityType: E_EntityType
        name: string
        relevanceScore: number
        excerpt?: string
    }[]
    pagination: {
        total: number
        limit: number
        offset: number
        hasMore: boolean
    }
    timestamp: string
    requestId: string
}

export interface I_ValidateWorldRequest {
    worldId: T_ObjectId
    checkIntegrity?: boolean
    checkRulesets?: boolean
}

export interface I_ValidateWorldResponse {
    success: boolean
    isValid: boolean
    errors: {
        code: string
        message: string
        severity: 'error' | 'warning' | 'info'
    }[]
    warnings: {
        message: string
        affectedEntities: number
    }[]
    timestamp: string
    requestId: string
}

// ============================================================================
// BATCH REQUEST
// ============================================================================

export interface I_BatchRequest {
    requests: {
        method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
        path: string
        body?: Record<string, any>
    }[]
    continueOnError?: boolean
}

export interface I_BatchResponse {
    success: boolean
    results: Array<{
        method: string
        path: string
        status: number
        data?: any
        error?: {
            code: string
            message: string
        }
    }>
    timestamp: string
    requestId: string
}
