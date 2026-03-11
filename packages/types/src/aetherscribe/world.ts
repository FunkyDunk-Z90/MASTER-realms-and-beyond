/**
 * @rnb/types - AetherScribe World Types
 * Core types from @rnb/validators. Extended stats types live here.
 */

import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'

export type {
    T_WorldVisibility,
    T_CollaboratorRole,
    T_World,
    T_Campaign,
    T_WorldSection,
    T_CreateWorldRequest,
    T_UpdateWorldRequest,
} from '@rnb/validators'

import type { T_World, T_Campaign, T_WorldSection } from '@rnb/validators'

// ─── I_* Aliases ──────────────────────────────────────────────────────────────

export type I_World = T_World
export type I_Campaign = T_Campaign
export type I_WorldSection = T_WorldSection

// ─── Extended Types ───────────────────────────────────────────────────────────

export interface I_WorldStats {
    worldId: T_ObjectId
    characters: {
        total: number
        byRuleset: { generic: number; dnd_5e_24: number; aetherscape: number }
        byClass?: Record<string, number>
        byRace?: Record<string, number>
    }
    npcs: {
        total: number
        byRuleset: { generic: number; dnd_5e_24: number; aetherscape: number }
    }
    locations: { total: number; withCoordinates: number }
    items: {
        total: number
        byRuleset: { generic: number; dnd_5e_24: number; aetherscape: number }
    }
    factions: { total: number }
    spells: { total: number }
    beliefs: { total: number }
    lore: { total: number }
    totalEntities: number
    calculatedAt: T_Timestamp
}
