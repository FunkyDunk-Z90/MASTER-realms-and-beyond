/**
 * @rnb/types - AetherScribe Entity Types (Refactored)
 * Polymorphic entities using separate ruleset type definitions
 */

import type { T_ObjectId, T_Timestamp } from '../global/common'
import type {
    I_DND5E_Character,
    I_DND5E_NPC,
    I_Class,
    I_Race,
    I_Spell,
    I_Item,
    I_Aetherscape_Character,
    I_Aetherscape_NPC,
    I_Archetype,
    I_Origin,
    I_Gift,
    I_Artifact,
} from './rulesets/rulesetsIndex'

// ============================================================================
// ENTITY TYPE ENUM
// ============================================================================

export enum E_EntityType {
    CHARACTER = 'character',
    NPC = 'npc',
    LOCATION = 'location',
    ITEM = 'item',
    FACTION = 'faction',
    // Ruleset-specific entities
    SPECIES = 'species', // D&D 5e
    CLASS = 'class', // D&D 5e
    BACKGROUND = 'background', // D&D 5e
    SPELL = 'spell', // D&D 5e
    BELIEF = 'belief', // Generic
    LORE = 'lore', // Generic
    ARCHETYPE = 'archetype', // Aetherscape
    ORIGIN = 'origin', // Aetherscape
    GIFT = 'gift', // Aetherscape
    ARTIFACT = 'artifact', // Aetherscape
}

export enum E_Ruleset {
    GENERIC = 'generic',
    DND_5E_24 = 'dnd_5e_24',
    AETHERSCAPE = 'aetherscape',
}

// ============================================================================
// BASE ENTITY
// ============================================================================

export interface I_BaseEntity {
    id: T_ObjectId
    worldId: T_ObjectId
    userId: T_ObjectId
    type: E_EntityType
    name: string
    slug: string
    description?: string
    tags: string[]
    isPrivate: boolean
    ruleset: E_Ruleset
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
    version: number
}

// ============================================================================
// CHARACTER ENTITY
// ============================================================================

export interface I_CharacterEntity extends I_BaseEntity {
    type: E_EntityType.CHARACTER
    data: I_DND5E_Character | I_Aetherscape_Character | I_GenericCharacter
    metadata?: {
        portraitUrl?: string
        lastPlayed?: T_Timestamp
        playingNotes?: string
        campaignIds?: T_ObjectId[]
    }
}

export interface I_GenericCharacter {
    ruleset: 'generic'
    age?: number
    race?: string
    class?: string
    alignment?: string
    backstory?: string
    personality?: string
    motivations?: string[]
    flaws?: string[]
    skills?: string[]
    equipment?: string[]
    portrait?: string
    status?: string
    customData?: {
        [key: string]: any
    }
}

// ============================================================================
// NPC ENTITY
// ============================================================================

export interface I_NPCEntity extends I_BaseEntity {
    type: E_EntityType.NPC
    data: I_DND5E_NPC | I_Aetherscape_NPC | I_GenericNPC
    relationships: {
        targetEntityId: T_ObjectId
        relationshipType: string
        description?: string
    }[]
    metadata?: {
        portraitUrl?: string
        affiliationIds?: T_ObjectId[]
        encounterNotes?: string
    }
}

export interface I_GenericNPC {
    ruleset: 'generic'
    role?: string
    affiliation?: string
    personality?: string
    goals?: string[]
    knowledge?: string[]
    portrait?: string
    customData?: {
        [key: string]: any
    }
}

// ============================================================================
// LOCATION ENTITY
// ============================================================================

export interface I_LocationEntity extends I_BaseEntity {
    type: E_EntityType.LOCATION
    data: I_LocationData
    inhabitants: T_ObjectId[]
    relatedLocations: {
        locationId: T_ObjectId
        relationshipType: string
    }[]
}

export interface I_LocationData {
    locationType?: string
    coordinates?: {
        x: number
        y: number
        z?: number
        system?: 'cartesian' | 'hexagonal' | 'other'
    }
    environment?: string
    climate?: string
    population?: number
    landmarks?: string[]
    imageUrl?: string
    accessNotes?: string
    history?: string
    factions?: {
        factionId: T_ObjectId
        control: 'full' | 'partial' | 'contested' | 'none'
    }[]
}

// ============================================================================
// ITEM ENTITY
// ============================================================================

export interface I_ItemEntity extends I_BaseEntity {
    type: E_EntityType.ITEM
    data:
        | (I_Item & { ruleset: E_Ruleset.DND_5E_24 })
        | (I_Artifact & { ruleset: E_Ruleset.AETHERSCAPE })
        | (I_GenericItem & { ruleset: E_Ruleset.GENERIC })
    owner?: T_ObjectId
    location?: T_ObjectId
    metadata?: {
        imageUrl?: string
        quantity?: number
        condition?: 'pristine' | 'good' | 'damaged' | 'cursed'
    }
}

export interface I_GenericItem {
    ruleset: 'generic'
    itemType?: string
    rarity?: string
    properties?: string[]
    value?: number
    weight?: number
    magical?: boolean
    enchantments?: string[]
    creator?: string
    history?: string
}

// ============================================================================
// FACTION ENTITY
// ============================================================================

export interface I_FactionEntity extends I_BaseEntity {
    type: E_EntityType.FACTION
    data: I_FactionData
    members: {
        entityId: T_ObjectId
        role: string
        joinedAt: T_Timestamp
    }[]
    relations: {
        factionId: T_ObjectId
        type: 'ally' | 'enemy' | 'neutral' | 'vassal' | 'overlord'
        description?: string
    }[]
}

export interface I_FactionData {
    factionType?: string
    headquarters?: T_ObjectId // Location reference
    primaryLeader?: T_ObjectId // NPC reference
    description?: string
    goals?: string[]
    resources?: string[]
    influence?: number
    size?: 'tiny' | 'small' | 'medium' | 'large' | 'huge'
    alignment?: string
    established?: T_Timestamp
    knownSecrets?: string[]
    customData?: {
        [key: string]: any
    }
}

// ============================================================================
// RULESET-SPECIFIC ENTITIES (D&D 5e)
// ============================================================================

export interface I_SpeciesEntity extends I_BaseEntity {
    type: E_EntityType.SPECIES
    ruleset: E_Ruleset.DND_5E_24
    data: I_Race
}

export interface I_ClassEntity extends I_BaseEntity {
    type: E_EntityType.CLASS
    ruleset: E_Ruleset.DND_5E_24
    data: I_Class
}

export interface I_BackgroundEntity extends I_BaseEntity {
    type: E_EntityType.BACKGROUND
    ruleset: E_Ruleset.DND_5E_24
    data: {
        id: string
        name: string
        skillProficiencies: string[]
        toolProficiencies?: string[]
        languages?: string[]
        equipment?: string[]
        feat?: string
        customFeature?: {
            name: string
            description: string
        }
    }
}

export interface I_SpellEntity extends I_BaseEntity {
    type: E_EntityType.SPELL
    ruleset: E_Ruleset.DND_5E_24
    data: I_Spell
    componentMaterials?: {
        itemId: T_ObjectId
        quantity: number
        consumed: boolean
    }[]
}

// ============================================================================
// GENERIC ENTITIES
// ============================================================================

export interface I_BeliefEntity extends I_BaseEntity {
    type: E_EntityType.BELIEF
    ruleset: E_Ruleset.GENERIC
    data: {
        deityName?: string
        domains?: string[]
        alignment: string
        tenets?: string[]
        practices?: string[]
        rituals?: string[]
        followers: T_ObjectId[]
        iconUrl?: string
    }
}

export interface I_LoreEntity extends I_BaseEntity {
    type: E_EntityType.LORE
    ruleset: E_Ruleset.GENERIC
    data: {
        category: string
        era?: string
        significance?: string
        sources?: string[]
        timeline?: {
            period: string
            event: string
            description?: string
        }[]
        relatedEntities: {
            entityId: T_ObjectId
            relationshipType: string
        }[]
    }
}

// ============================================================================
// RULESET-SPECIFIC ENTITIES (AETHERSCAPE)
// ============================================================================

export interface I_ArchetypeEntity extends I_BaseEntity {
    type: E_EntityType.ARCHETYPE
    ruleset: E_Ruleset.AETHERSCAPE
    data: I_Archetype
}

export interface I_OriginEntity extends I_BaseEntity {
    type: E_EntityType.ORIGIN
    ruleset: E_Ruleset.AETHERSCAPE
    data: I_Origin
}

export interface I_GiftEntity extends I_BaseEntity {
    type: E_EntityType.GIFT
    ruleset: E_Ruleset.AETHERSCAPE
    data: I_Gift
    prerequisites?: {
        giftId: T_ObjectId
        essenceLevel?: number
        resonanceLevel?: number
    }[]
}

export interface I_ArtifactEntity extends I_BaseEntity {
    type: E_EntityType.ARTIFACT
    ruleset: E_Ruleset.AETHERSCAPE
    data: I_Artifact
    currentOwner?: T_ObjectId
    currentLocation?: T_ObjectId
}

// ============================================================================
// POLYMORPHIC ENTITY TYPE
// ============================================================================

export type I_Entity =
    | I_CharacterEntity
    | I_NPCEntity
    | I_LocationEntity
    | I_ItemEntity
    | I_FactionEntity
    | I_SpeciesEntity
    | I_ClassEntity
    | I_BackgroundEntity
    | I_SpellEntity
    | I_BeliefEntity
    | I_LoreEntity
    | I_ArchetypeEntity
    | I_OriginEntity
    | I_GiftEntity
    | I_ArtifactEntity

// ============================================================================
// REQUEST TYPES
// ============================================================================

export interface I_EntityFilter {
    type?: E_EntityType | E_EntityType[]
    ruleset?: E_Ruleset | E_Ruleset[]
    tags?: string[]
    isPrivate?: boolean
    createdAfter?: T_Timestamp
    createdBefore?: T_Timestamp
    userId?: T_ObjectId
    search?: string
}

// ============================================================================
// RELATIONSHIP TRACKING
// ============================================================================

export interface I_EntityRelation {
    id: T_ObjectId
    fromEntityId: T_ObjectId
    toEntityId: T_ObjectId
    relationshipType: string
    description?: string
    isDirectional: boolean
    strength?: number // 1-10 for importance
    metadata?: {
        [key: string]: any
    }
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}

// ============================================================================
// UTILITIES
// ============================================================================

export type I_EntityByType<T extends E_EntityType> =
    T extends E_EntityType.CHARACTER
        ? I_CharacterEntity
        : T extends E_EntityType.NPC
          ? I_NPCEntity
          : T extends E_EntityType.LOCATION
            ? I_LocationEntity
            : T extends E_EntityType.ITEM
              ? I_ItemEntity
              : T extends E_EntityType.FACTION
                ? I_FactionEntity
                : T extends E_EntityType.SPELL
                  ? I_SpellEntity
                  : I_Entity

export function isEntityType<T extends E_EntityType>(
    entity: I_Entity,
    type: T
): entity is I_EntityByType<T> {
    return entity.type === type
}
