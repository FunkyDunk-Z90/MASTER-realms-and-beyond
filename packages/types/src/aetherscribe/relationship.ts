/**
 * @rnb/types - AetherScribe Relationship Types (Refactored)
 * Entity relationships with ruleset support and metadata
 */

import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'
import type { E_EntityType, E_Ruleset } from './entity'

// ============================================================================
// RELATIONSHIP TYPES
// ============================================================================

// Character to Character / NPC
// Hierarchical / Possession / Location / Organization / Belief / Lore / Generic
export type E_RelationType =
    | 'ally'
    | 'enemy'
    | 'rival'
    | 'friend'
    | 'lover'
    | 'family'
    | 'mentor'
    | 'student'
    | 'leader'
    | 'subordinate'
    | 'owns'
    | 'owned_by'
    | 'carries'
    | 'wielded_by'
    | 'located_in'
    | 'contains'
    | 'borders'
    | 'connected_to'
    | 'member_of'
    | 'leads'
    | 'allied_with'
    | 'opposed_to'
    | 'vassal_of'
    | 'overlord_of'
    | 'worships'
    | 'priesthood_of'
    | 'opposed_belief'
    | 'caused_by'
    | 'resulted_in'
    | 'influenced_by'
    | 'influences'
    | 'custom'

// ============================================================================
// RELATIONSHIP STRENGTH & DIRECTION
// ============================================================================

export type RelationshipStrength = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface I_RelationshipDirection {
    isDirectional: boolean
    reverseType?: string // For bidirectional (e.g., ALLY <-> ALLY)
}

// ============================================================================
// BASE RELATIONSHIP
// ============================================================================

export interface I_Relationship {
    id: T_ObjectId
    worldId: T_ObjectId

    // Entities
    fromEntityId: T_ObjectId
    fromEntityType: E_EntityType
    toEntityId: T_ObjectId
    toEntityType: E_EntityType

    // Relationship definition
    type: E_RelationType
    customLabel?: string // For CUSTOM relationships
    description?: string

    // Direction
    isDirectional: boolean
    reverseRelationshipId?: T_ObjectId

    // Strength/importance
    strength: RelationshipStrength // 1-10

    // Ruleset
    ruleset: E_Ruleset

    // Metadata
    metadata?: {
        since?: T_Timestamp // When relationship started
        until?: T_Timestamp // When relationship ended
        status?: 'active' | 'dormant' | 'broken' | 'resolved'
        publicKnowledge: boolean
        secretDetails?: string
        [key: string]: any
    }

    // Timestamps
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}

// ============================================================================
// RELATIONSHIP SPECIFIC DATA
// ============================================================================

export interface I_CharacterRelationshipData {
    emotionalTone?: 'positive' | 'negative' | 'neutral' | 'complex'
    mutualAwareness: boolean // Do both characters know of the relationship?
    depth?: string // How well do they know each other?
    history?: string // Story of their relationship
    sharedGoals?: string[]
    conflicts?: string[]
    secrets?: {
        holder: T_ObjectId
        secret: string
    }[]
}

export interface I_LocationRelationshipData {
    distance?: number
    travelTime?: string
    pathType?: string // 'direct', 'dangerous', 'secret'
    knownConnections: boolean
}

export interface I_FactionRelationshipData {
    tradeStatus?: 'active' | 'inactive' | 'forbidden'
    militaryThreat?: 'low' | 'medium' | 'high'
    allianceTerms?: string
    violations?: string[]
    warStatus?: 'peace' | 'cold_war' | 'active_war'
}

export interface I_ItemOwnershipData {
    previousOwners?: {
        entityId: T_ObjectId
        from: T_Timestamp
        to?: T_Timestamp
        notes?: string
    }[]
    stolen: boolean
    enchantmentBond?: boolean
}

// ============================================================================
// RELATIONSHIP NETWORKS
// ============================================================================

export interface I_RelationshipNetwork {
    entityId: T_ObjectId
    outgoing: I_Relationship[] // Relationships FROM this entity
    incoming: I_Relationship[] // Relationships TO this entity

    connections: {
        directly: {
            count: number
            types: Partial<Record<E_RelationType, number>>
        }
        twoDegreesAway: {
            count: number
            types: Partial<Record<E_RelationType, number>>
        }
        threeDegrees: {
            count: number
        }
    }

    networkInfluence?: {
        centrality: number // 0-100
        importance: number
        isolation: number
    }
}

// ============================================================================
// RELATIONSHIP QUERIES & FILTERS
// ============================================================================

export interface I_RelationshipQuery {
    worldId: T_ObjectId
    fromEntityId?: T_ObjectId
    toEntityId?: T_ObjectId
    type?: E_RelationType | E_RelationType[]
    isDirectional?: boolean
    minStrength?: RelationshipStrength
    ruleset?: E_Ruleset
    includeMetadata?: boolean
}

export interface I_RelationshipMap {
    worldId: T_ObjectId
    center: T_ObjectId
    depth: 1 | 2 | 3 // How many degrees to show
    relationships: I_Relationship[]
    connectedEntities: {
        entityId: T_ObjectId
        entityType: E_EntityType
        connections: number
    }[]
}

// ============================================================================
// RELATIONSHIP EVENTS/CHANGES
// ============================================================================

export interface I_RelationshipEvent {
    id: T_ObjectId
    relationshipId: T_ObjectId
    eventType:
        | 'created'
        | 'strengthened'
        | 'weakened'
        | 'changed'
        | 'ended'
        | 'reconciled'
    description: string
    date: T_Timestamp
    impact?: string // How this event affected the relationship
}

export interface I_RelationshipHistory {
    relationshipId: T_ObjectId
    events: I_RelationshipEvent[]
    currentStatus: 'active' | 'dormant' | 'broken' | 'resolved'
    evolved: boolean
}

// ============================================================================
// BULK RELATIONSHIPS
// ============================================================================

export interface I_BulkRelationshipCreate {
    worldId: T_ObjectId
    relationships: Omit<I_Relationship, 'id' | 'createdAt' | 'updatedAt'>[]
}

export interface I_BulkRelationshipUpdate {
    relationshipIds: T_ObjectId[]
    updates: Partial<Omit<I_Relationship, 'id' | 'createdAt' | 'updatedAt'>>
}

// ============================================================================
// RELATIONSHIP STATISTICS
// ============================================================================

export interface I_RelationshipStats {
    worldId: T_ObjectId
    total: number
    byType: Partial<Record<E_RelationType, number>>
    byRuleset: {
        generic: number
        dnd_5e_24: number
        aetherscape: number
    }
    directional: number
    bidirectional: number
    averageStrength: number
    strongRelationships: number // strength >= 7
    brokenRelationships: number
    secretRelationships: number
    averageConnectionsPerEntity: number
    mostConnectedEntity?: {
        entityId: T_ObjectId
        connections: number
    }
}

// ============================================================================
// RELATIONSHIP SUGGESTIONS
// ============================================================================

export interface I_RelationshipSuggestion {
    fromEntityId: T_ObjectId
    toEntityId: T_ObjectId
    suggestedTypes: E_RelationType[]
    reasoning: string
    confidence: number // 0-100
    basedOnRuleset: E_Ruleset
    basedOnEntityTypes: {
        from: E_EntityType
        to: E_EntityType
    }
}
