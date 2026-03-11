/**
 * @rnb/types - AetherScribe Request Types
 * Core request types from @rnb/validators. Extended/response types live here.
 */

import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'
import type { T_EntityType, T_RelationType, T_RelationshipStrength } from '@rnb/validators'
import type { I_World, I_WorldStats } from './world'
import type { I_ApiSuccess } from '../global/api-responses'
import type { I_ErrorResponse } from '../global/errors'

export type {
    T_CreateEntityRequest,
    T_UpdateEntityRequest,
    T_BulkDeleteEntityRequest,
    T_ListEntitiesRequest,
    T_CreateWorldRequest,
    T_UpdateWorldRequest,
    T_AddCollaboratorRequest,
    T_CreateRelationshipRequest,
    T_CreateCampaignRequest,
    T_SearchEntitiesRequest,
    T_ExportWorldRequest,
} from '@rnb/validators'

import type {
    T_CreateEntityRequest,
    T_UpdateEntityRequest,
    T_CreateWorldRequest,
    T_CreateRelationshipRequest,
} from '@rnb/validators'

// ─── I_* Aliases for validators types ─────────────────────────────────────────

export type I_CreateEntityRequest = T_CreateEntityRequest
export type I_UpdateEntityRequest = T_UpdateEntityRequest
export type I_CreateWorldRequest = T_CreateWorldRequest
export type I_CreateRelationshipRequest = T_CreateRelationshipRequest

// ─── Extended Request Types ───────────────────────────────────────────────────

export interface I_BulkUpdateEntityRequest {
    ids: T_ObjectId[]
    updates: Partial<T_UpdateEntityRequest>
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

export interface I_GetWorldRequest {
    id: T_ObjectId
    includeStats?: boolean
    includeCampaigns?: boolean
    includeSections?: boolean
}

export interface I_DeleteWorldRequest {
    id: T_ObjectId
    hardDelete?: boolean
}

export interface I_GetWorldStatsRequest {
    worldId: T_ObjectId
    includeRulesetBreakdown?: boolean
    includeDetailedStats?: boolean
    includeContentCoverage?: boolean
    includeRelationships?: boolean
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

export interface I_UpdateCampaignRequest {
    id: T_ObjectId
    name?: string
    description?: string
    status?: 'planning' | 'active' | 'paused' | 'completed'
}

export interface I_AddCampaignParticipantRequest {
    campaignId: T_ObjectId
    userId: T_ObjectId
    role: 'dm' | 'player'
    characterId?: T_ObjectId
}

export interface I_LogCampaignSessionRequest {
    campaignId: T_ObjectId
    sessionNumber: number
    summary: string
    date?: T_Timestamp
}

export interface I_CreateWorldSectionRequest {
    worldId: T_ObjectId
    name: string
    description?: string
    parentSectionId?: T_ObjectId
    linkedEntities?: T_ObjectId[]
}

export interface I_UpdateRelationshipRequest {
    id: T_ObjectId
    type?: T_RelationType
    customLabel?: string
    description?: string
    strength?: T_RelationshipStrength
    metadata?: {
        since?: T_Timestamp
        until?: T_Timestamp
        status?: 'active' | 'dormant' | 'broken' | 'resolved'
        publicKnowledge?: boolean
        secretDetails?: string
    }
}

export interface I_ListRelationshipsRequest {
    worldId: T_ObjectId
    fromEntityId?: T_ObjectId
    toEntityId?: T_ObjectId
    type?: T_RelationType | T_RelationType[]
    minStrength?: T_RelationshipStrength
    isDirectional?: boolean
    limit?: number
    offset?: number
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

export interface I_BatchRequest {
    requests: {
        method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
        path: string
        body?: Record<string, any>
    }[]
    continueOnError?: boolean
}

// ─── Response Types ───────────────────────────────────────────────────────────

export type I_SuccessResponse<T> = I_ApiSuccess<T>
export type T_Response<T> = I_ApiSuccess<T> | I_ErrorResponse

export interface I_ListResponse<T> {
    success: true
    data: T[]
    pagination: { total: number; limit: number; offset: number; hasMore: boolean }
    timestamp: string
    requestId: string
}

export interface I_WorldResponse {
    success: boolean
    data?: I_World
    error?: { code: string; message: string }
    timestamp: string
    requestId: string
}

export interface I_WorldStatsResponse {
    success: boolean
    data?: I_WorldStats
    error?: { code: string; message: string }
    timestamp: string
    requestId: string
}

export interface I_SearchEntitiesResponse {
    success: boolean
    data: {
        entityId: T_ObjectId
        entityType: T_EntityType
        name: string
        relevanceScore: number
        excerpt?: string
    }[]
    pagination: { total: number; limit: number; offset: number; hasMore: boolean }
    timestamp: string
    requestId: string
}

export interface I_ValidateWorldResponse {
    success: boolean
    isValid: boolean
    errors: { code: string; message: string; severity: 'error' | 'warning' | 'info' }[]
    warnings: { message: string; affectedEntities: number }[]
    timestamp: string
    requestId: string
}

export interface I_BatchResponse {
    success: boolean
    results: {
        method: string
        path: string
        status: number
        data?: any
        error?: { code: string; message: string }
    }[]
    timestamp: string
    requestId: string
}
