/**
 * @rnb/types — AetherScribe World Types
 */

import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'

export type {
    T_WorldVisibility,
    T_CollaboratorRole,
    T_World,
    T_CreateWorldRequest,
    T_UpdateWorldRequest,
    T_MagicLevel,
    T_ToneDifficulty,
    T_TechLevel,
    T_Campaign,
    T_CreateCampaignRequest,
    T_UpdateCampaignRequest,
} from '@rnb/validators'

import type {
    T_World,
    T_Campaign,
} from '@rnb/validators'

// ─── I_* Aliases ──────────────────────────────────────────────────────────────

export type I_World = T_World
export type I_Campaign = T_Campaign

// ─── Extended Types ───────────────────────────────────────────────────────────

export interface I_WorldStats {
    worldId: T_ObjectId
    characters: { total: number }
    npcs: { total: number }
    locations: { total: number }
    items: { total: number }
    factions: { total: number }
    arcana: { total: number }
    lore: { total: number }
    nations: { total: number }
    bestiary: { total: number }
    totalEntities: number
    calculatedAt: T_Timestamp
}
