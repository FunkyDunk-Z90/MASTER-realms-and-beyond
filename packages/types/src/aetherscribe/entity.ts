/**
 * @rnb/types - AetherScribe Entity Types
 * Core enum and base types from @rnb/validators.
 * Complex polymorphic entity variants live here (depend on ruleset types).
 */

import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'
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

export type {
    T_EntityType,
    T_Ruleset,
    T_BaseEntity,
    T_EntityFilter,
    T_EntityRelation,
} from '@rnb/validators'

import type { T_EntityType, T_Ruleset, T_BaseEntity } from '@rnb/validators'

// ─── E_* / I_* Aliases ────────────────────────────────────────────────────────

export type E_EntityType = T_EntityType
export type E_Ruleset = T_Ruleset
export type I_BaseEntity = T_BaseEntity

// ─── Generic Character Data ───────────────────────────────────────────────────

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
    customData?: Record<string, any>
}

export interface I_GenericNPC {
    ruleset: 'generic'
    role?: string
    affiliation?: string
    personality?: string
    goals?: string[]
    knowledge?: string[]
    portrait?: string
    customData?: Record<string, any>
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

// ─── Entity Variants ──────────────────────────────────────────────────────────

export interface I_CharacterEntity extends I_BaseEntity {
    type: 'character'
    data: I_DND5E_Character | I_Aetherscape_Character | I_GenericCharacter
    metadata?: {
        portraitUrl?: string
        lastPlayed?: T_Timestamp
        playingNotes?: string
        campaignIds?: T_ObjectId[]
    }
}

export interface I_NPCEntity extends I_BaseEntity {
    type: 'npc'
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

export interface I_LocationEntity extends I_BaseEntity {
    type: 'location'
    data: I_LocationData
    inhabitants: T_ObjectId[]
    relatedLocations: {
        locationId: T_ObjectId
        relationshipType: string
    }[]
}

export interface I_ItemEntity extends I_BaseEntity {
    type: 'item'
    data:
        | (I_Item & { ruleset: 'dnd_5e_24' })
        | (I_Artifact & { ruleset: 'aetherscape' })
        | (I_GenericItem & { ruleset: 'generic' })
    owner?: T_ObjectId
    location?: T_ObjectId
    metadata?: {
        imageUrl?: string
        quantity?: number
        condition?: 'pristine' | 'good' | 'damaged' | 'cursed'
    }
}

export interface I_FactionData {
    factionType?: string
    headquarters?: T_ObjectId
    primaryLeader?: T_ObjectId
    description?: string
    goals?: string[]
    resources?: string[]
    influence?: number
    size?: 'tiny' | 'small' | 'medium' | 'large' | 'huge'
    alignment?: string
    established?: T_Timestamp
    knownSecrets?: string[]
    customData?: Record<string, any>
}

export interface I_FactionEntity extends I_BaseEntity {
    type: 'faction'
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

export interface I_SpeciesEntity extends I_BaseEntity {
    type: 'species'
    ruleset: 'dnd_5e_24'
    data: I_Race
}

export interface I_ClassEntity extends I_BaseEntity {
    type: 'class'
    ruleset: 'dnd_5e_24'
    data: I_Class
}

export interface I_BackgroundEntity extends I_BaseEntity {
    type: 'background'
    ruleset: 'dnd_5e_24'
    data: {
        id: string
        name: string
        skillProficiencies: string[]
        toolProficiencies?: string[]
        languages?: string[]
        equipment?: string[]
        feat?: string
        customFeature?: { name: string; description: string }
    }
}

export interface I_SpellEntity extends I_BaseEntity {
    type: 'spell'
    ruleset: 'dnd_5e_24'
    data: I_Spell
    componentMaterials?: {
        itemId: T_ObjectId
        quantity: number
        consumed: boolean
    }[]
}

export interface I_BeliefEntity extends I_BaseEntity {
    type: 'belief'
    ruleset: 'generic'
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
    type: 'lore'
    ruleset: 'generic'
    data: {
        category: string
        era?: string
        significance?: string
        sources?: string[]
        timeline?: { period: string; event: string; description?: string }[]
        relatedEntities: { entityId: T_ObjectId; relationshipType: string }[]
    }
}

export interface I_ArchetypeEntity extends I_BaseEntity {
    type: 'archetype'
    ruleset: 'aetherscape'
    data: I_Archetype
}

export interface I_OriginEntity extends I_BaseEntity {
    type: 'origin'
    ruleset: 'aetherscape'
    data: I_Origin
}

export interface I_GiftEntity extends I_BaseEntity {
    type: 'gift'
    ruleset: 'aetherscape'
    data: I_Gift
    prerequisites?: {
        giftId: T_ObjectId
        essenceLevel?: number
        resonanceLevel?: number
    }[]
}

export interface I_ArtifactEntity extends I_BaseEntity {
    type: 'artifact'
    ruleset: 'aetherscape'
    data: I_Artifact
    currentOwner?: T_ObjectId
    currentLocation?: T_ObjectId
}

// ─── Polymorphic Union ────────────────────────────────────────────────────────

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

export type I_EntityByType<T extends T_EntityType> =
    T extends 'character'
        ? I_CharacterEntity
        : T extends 'npc'
          ? I_NPCEntity
          : T extends 'location'
            ? I_LocationEntity
            : T extends 'item'
              ? I_ItemEntity
              : T extends 'faction'
                ? I_FactionEntity
                : T extends 'spell'
                  ? I_SpellEntity
                  : I_Entity

export function isEntityType<T extends T_EntityType>(
    entity: I_Entity,
    type: T
): entity is I_EntityByType<T> {
    return entity.type === type
}
