/**
 * @rnb/types — AetherScribe Codex Types
 */

export type {
    T_Codex,
    T_CreateCodexRequest,
    T_UpdateCodexRequest,
} from '@rnb/validators'

import type { T_Codex } from '@rnb/validators'
import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'

// ─── Aliases ──────────────────────────────────────────────────────────────────

export type I_Codex = T_Codex

// ─── Content inventory per codex category ─────────────────────────────────────

export interface I_ContentItem {
    contentId: string
    contentName: string
    subCategory?: string
    worldId?: T_ObjectId
}

export interface I_AetherScribeContent {
    worlds: I_ContentItem[]
    campaigns: I_ContentItem[]
    playerCharacters: I_ContentItem[]
    npcs: I_ContentItem[]
    bestiary: I_ContentItem[]
    ancestries: I_ContentItem[]
    lore: I_ContentItem[]
    items: I_ContentItem[]
    arcana: I_ContentItem[]
    locations: I_ContentItem[]
    nations: I_ContentItem[]
    factions: I_ContentItem[]
}

// ─── Codex summary (with content counts) ─────────────────────────────────────

export interface I_CodexSummary {
    codex: I_Codex
    contentCounts: {
        worlds: number
        campaigns: number
        playerCharacters: number
        npcs: number
        bestiary: number
        ancestries: number
        lore: number
        items: number
        arcana: number
        locations: number
        nations: number
        factions: number
        total: number
    }
    lastUpdated: T_Timestamp
}
