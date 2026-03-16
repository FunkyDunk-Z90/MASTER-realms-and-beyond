/**
 * @rnb/types — AetherScribe Request & Response Types
 */

import type { T_ObjectId } from '../global/common/commonIndex'
import type { I_ApiSuccess } from '../global/api-responses'
import type { I_ErrorResponse } from '../global/errors'
import type { I_Codex } from './codex'
import type { I_World } from './world'
import type { T_RelationType, T_RelationshipStrength } from '@rnb/validators'

export type {
    T_CreateWorldRequest,
    T_UpdateWorldRequest,
    T_CreateCampaignRequest,
    T_UpdateCampaignRequest,
    T_CreatePlayerCharacterRequest,
    T_UpdatePlayerCharacterRequest,
    T_CreateNpcRequest,
    T_UpdateNpcRequest,
    T_CreateBestiaryEntryRequest,
    T_UpdateBestiaryEntryRequest,
    T_CreateAncestryRequest,
    T_UpdateAncestryRequest,
    T_CreateLoreRequest,
    T_UpdateLoreRequest,
    T_CreateItemRequest,
    T_UpdateItemRequest,
    T_CreateArcanaRequest,
    T_UpdateArcanaRequest,
    T_CreateLocationRequest,
    T_UpdateLocationRequest,
    T_CreateNationRequest,
    T_UpdateNationRequest,
    T_CreateFactionRequest,
    T_UpdateFactionRequest,
    T_CreateRelationshipRequest,
    T_UpdateRelationshipRequest,
    T_CreateCodexRequest,
    T_UpdateCodexRequest,
    T_CreateAetherscribeAccount,
} from '@rnb/validators'

// ─── Response Types ───────────────────────────────────────────────────────────

export type I_SuccessResponse<T> = I_ApiSuccess<T>
export type T_Response<T> = I_ApiSuccess<T> | I_ErrorResponse

export interface I_ListResponse<T> {
    items: T[]
    pagination: { total: number; limit: number; offset: number; hasMore: boolean }
}

export interface I_UpdateRelationshipRequest {
    type?: T_RelationType
    customLabel?: string
    description?: string
    strength?: T_RelationshipStrength
    metadata?: {
        since?: number
        until?: number
        status?: 'active' | 'dormant' | 'broken' | 'resolved'
        publicKnowledge?: boolean
        secretDetails?: string
    }
}
