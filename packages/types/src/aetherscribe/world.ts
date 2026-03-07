/**
 * @rnb/types - AetherScribe World Types (Refactored)
 * World management with comprehensive ruleset statistics
 */

import type { T_ObjectId, T_Timestamp } from '../global/common'
import type { E_Ruleset } from './entity'

// ============================================================================
// WORLD CORE
// ============================================================================

export interface I_World {
    id: T_ObjectId
    userId: T_ObjectId
    name: string
    slug: string
    description?: string
    primaryRuleset: E_Ruleset
    supportedRulesets: E_Ruleset[]
    visibility: 'private' | 'friends_only' | 'public'
    tags: string[]

    metadata?: {
        coverImageUrl?: string
        backgroundColor?: string
        theme?: string
        toneDifficulty?: 'light' | 'balanced' | 'dark' | 'grimdark'
    }

    collaborators: {
        userId: T_ObjectId
        role: 'viewer' | 'editor' | 'admin'
        addedAt: T_Timestamp
    }[]

    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}

// ============================================================================
// WORLD STATISTICS
// ============================================================================

export interface I_WorldStats {
    worldId: T_ObjectId

    characters: {
        total: number
        byRuleset: { generic: number; dnd_5e_24: number; aetherscape: number }
        byClass?: { [key: string]: number }
        byRace?: { [key: string]: number }
    }

    npcs: {
        total: number
        byRuleset: { generic: number; dnd_5e_24: number; aetherscape: number }
    }

    locations: {
        total: number
        withCoordinates: number
    }

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

export interface I_Campaign {
    id: T_ObjectId
    worldId: T_ObjectId
    name: string
    status: 'planning' | 'active' | 'paused' | 'completed'
    participants: {
        userId: T_ObjectId
        characterId?: T_ObjectId
        role: 'dm' | 'player'
    }[]
    createdAt: T_Timestamp
}

export interface I_WorldSection {
    id: T_ObjectId
    worldId: T_ObjectId
    name: string
    parentSectionId?: T_ObjectId
    linkedEntities: T_ObjectId[]
    createdAt: T_Timestamp
}
