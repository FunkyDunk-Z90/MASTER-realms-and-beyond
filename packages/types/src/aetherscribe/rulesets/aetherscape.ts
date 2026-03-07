/**
 * @rnb/types - Aetherscape Ruleset
 * Extensible type definitions for Aetherscape ruleset (To Be Determined)
 *
 * This file provides the foundational structure for the Aetherscape ruleset.
 * As the ruleset is finalized, these types will be expanded with specific mechanics.
 */

// ============================================================================
// CORE AETHERSCAPE CONCEPTS (TBD)
// ============================================================================

/**
 * Affinity represents the character's connection to different aspects of Aetherscape
 * TBD: Additional affinities will be defined as ruleset develops
 */
export enum E_Affinity {
    AETHER = 'aether', // TBD: Definition and mechanics
    VOID = 'void', // TBD: Definition and mechanics
    ESSENCE = 'essence', // TBD: Definition and mechanics
    UNKNOWN = 'unknown', // Unaligned / Neutral
}

/**
 * Essence represents a character's fundamental power/energy
 * TBD: Mechanics for essence accumulation, usage, and effects
 */
export interface I_Essence {
    current: number
    maximum: number
    affinity: E_Affinity
    recovery?: {
        rate: number
        recoveryType: 'long_rest' | 'short_rest' | 'meditation' | 'other'
    }
}

/**
 * Resonance represents harmony/attunement with the Aetherscape
 * TBD: Mechanics for resonance checks, scaling, and effects
 */
export interface I_Resonance {
    current: number
    maximum: number
    attunements: {
        affinityId: E_Affinity
        strength: number
        stability: number
    }[]
    harmonics?: {
        frequency: number
        waveform: string
        strength: number
    }[]
}

// ============================================================================
// CHARACTER ARCHETYPE (TBD)
// ============================================================================

/**
 * Aetherscape character archetype - TBD
 * This will be similar to Classes in D&D but for Aetherscape
 */
export interface I_Archetype {
    id: string
    name: string
    description?: string
    primaryAffinity: E_Affinity
    mechanics?: {
        [key: string]: any
    }
}

/**
 * Aetherscape character origin - TBD
 * Similar to backgrounds/races in other systems
 */
export interface I_Origin {
    id: string
    name: string
    description?: string
    traits?: string[]
    affinityBonus?: Partial<Record<E_Affinity, number>>
}

/**
 * Aetherscape ability/skill - TBD
 * Mechanics for how characters perform actions
 */
export interface I_Gift {
    id: string
    name: string
    description?: string
    affinity: E_Affinity
    essence_cost: number
    resonance_requirement: number
    mechanics?: {
        effect: string
        scaling?: string
        limitations?: string[]
    }
}

// ============================================================================
// CHARACTER SHEET (TBD)
// ============================================================================

export interface I_Aetherscape_Character {
    ruleset: 'aetherscape'
    archetype: string
    origin: string
    essence: I_Essence
    resonance: I_Resonance
    gifts: {
        giftId: string
        unlocked: boolean
        mastery: number // TBD: 0-100 or tiered system
    }[]
    connections?: {
        characterId: string
        type: string
        strength: number
    }[]
    corruptions?: {
        type: string
        severity: number // TBD: Scale definition
        effects: string[]
    }[]
    aspirations?: string[]
    flaws?: string[]
    backstory?: string
    notes?: string
    customData?: {
        [key: string]: any
    }
}

export interface I_Aetherscape_NPC {
    ruleset: 'aetherscape'
    archetype: string
    origin?: string
    essence: I_Essence
    resonance: I_Resonance
    gifts?: {
        giftId: string
        mastery: number
    }[]
    role?: string
    affiliation?: string
    goals?: string[]
    knowledge?: string[]
    corruptions?: {
        type: string
        severity: number
        effects: string[]
    }[]
    customData?: {
        [key: string]: any
    }
}

// ============================================================================
// EXTENDED MECHANICS (TBD)
// ============================================================================

/**
 * Resonance Check - TBD mechanics
 * Similar to ability checks in D&D
 */
export interface I_ResonanceCheck {
    affinity: E_Affinity
    difficulty: number // TBD: Scale definition
    effect: string
    consequence?: string
}

/**
 * Essence Cost Calculation - TBD
 */
export interface I_EssenceCost {
    base: number
    affinity: E_Affinity
    scaling?: {
        factor: number
        maxLevel: number
    }
}

/**
 * Aetherscape Condition - TBD
 * Status effects and their mechanics
 */
export interface I_Condition {
    id: string
    name: string
    affinity: E_Affinity
    effects: {
        stat: string
        modifier: number
        type: 'penalty' | 'bonus'
    }[]
    duration?: {
        turns: number
        endTrigger?: string
    }
    curable?: {
        method: string
        difficulty: number
    }
}

/**
 * Aetherscape Artifact - TBD
 * Powerful items with essence-based mechanics
 */
export interface I_Artifact {
    id: string
    name: string
    affinity: E_Affinity
    essence_requirement: number
    resonance_requirement: number
    properties: {
        passive?: string[]
        active?: {
            name: string
            essence_cost: number
            effect: string
        }[]
    }
    degradation?: {
        currentStatus: number
        maxStatus: number
        effects: string[]
    }
    bonds?: {
        characterId: string
        strength: number
        effects: string[]
    }[]
    history?: string
}

// ============================================================================
// FACTION/ORGANIZATION (TBD)
// ============================================================================

export interface I_Collective {
    id: string
    name: string
    description?: string
    primaryAffinity: E_Affinity
    secondaryAffinities?: E_Affinity[]
    members: {
        characterId: string
        role: string
        rank: number
    }[]
    goals?: string[]
    enemies?: string[]
    allies?: string[]
    artifacts?: string[]
    headquarters?: string
}

// ============================================================================
// RULESET CONFIGURATION (TBD)
// ============================================================================

export interface I_Aetherscape_RulesetConfig {
    version: 'TBD'
    status: 'development' | 'beta' | 'release'
    archetypes: I_Archetype[]
    origins: I_Origin[]
    gifts: I_Gift[]
    conditions: I_Condition[]
    artifacts: I_Artifact[]
    affinities: {
        id: E_Affinity
        name: string
        description: string
        mechanics?: {
            [key: string]: any
        }
    }[]
    customExtensions?: {
        [key: string]: any
    }
}

// ============================================================================
// MIGRATION & COMPATIBILITY (TBD)
// ============================================================================

/**
 * For converting characters between Aetherscape and other rulesets
 */
export interface I_Aetherscape_MappingRules {
    fromRuleset: string
    toRuleset: 'aetherscape'
    fieldMappings: {
        fromField: string
        toField: string
        transformFn?: (value: any) => any
    }[]
    defaults?: {
        essence?: number
        resonance?: number
        affinity?: E_Affinity
    }
}

// ============================================================================
// EXTENSIBILITY
// ============================================================================

/**
 * Allow custom data on any Aetherscape entity for future expansion
 */
export interface I_Extensible {
    customFields?: {
        [key: string]: {
            value: any
            type: 'string' | 'number' | 'boolean' | 'object' | 'array'
            metadata?: {
                [key: string]: any
            }
        }
    }
}

/**
 * Aetherscape Plugin System - TBD
 * For extending ruleset with house rules or variants
 */
export interface I_AetherspacePlugin {
    id: string
    name: string
    version: string
    author?: string
    description?: string
    modifications: {
        type: 'add' | 'modify' | 'remove'
        target: string
        changes: {
            [key: string]: any
        }
    }[]
    compatibility?: {
        minVersion: string
        maxVersion?: string
    }
}
