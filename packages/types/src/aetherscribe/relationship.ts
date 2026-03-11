/**
 * @rnb/types - AetherScribe Relationship Types
 * Core types from @rnb/validators. Extended analytics/network types live here.
 */

import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'
import type { T_EntityType, T_Ruleset } from '@rnb/validators'

export type {
    T_RelationType,
    T_RelationshipStrength,
    T_Relationship,
    T_CreateRelationshipRequest,
} from '@rnb/validators'

import type {
    T_RelationType,
    T_RelationshipStrength,
    T_Relationship,
} from '@rnb/validators'

// ─── E_* / I_* Aliases ────────────────────────────────────────────────────────

export type E_RelationType = T_RelationType
export type RelationshipStrength = T_RelationshipStrength
export type I_Relationship = T_Relationship

// ─── Extended Types (relationship detail & analytics) ─────────────────────────

export interface I_RelationshipDirection {
    isDirectional: boolean
    reverseType?: string
}

export interface I_CharacterRelationshipData {
    emotionalTone?: 'positive' | 'negative' | 'neutral' | 'complex'
    mutualAwareness: boolean
    depth?: string
    history?: string
    sharedGoals?: string[]
    conflicts?: string[]
    secrets?: { holder: T_ObjectId; secret: string }[]
}

export interface I_LocationRelationshipData {
    distance?: number
    travelTime?: string
    pathType?: string
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
    previousOwners?: { entityId: T_ObjectId; from: T_Timestamp; to?: T_Timestamp; notes?: string }[]
    stolen: boolean
    enchantmentBond?: boolean
}

export interface I_RelationshipNetwork {
    entityId: T_ObjectId
    outgoing: T_Relationship[]
    incoming: T_Relationship[]
    connections: {
        directly: { count: number; types: Partial<Record<T_RelationType, number>> }
        twoDegreesAway: { count: number; types: Partial<Record<T_RelationType, number>> }
        threeDegrees: { count: number }
    }
    networkInfluence?: { centrality: number; importance: number; isolation: number }
}

export interface I_RelationshipQuery {
    worldId: T_ObjectId
    fromEntityId?: T_ObjectId
    toEntityId?: T_ObjectId
    type?: T_RelationType | T_RelationType[]
    isDirectional?: boolean
    minStrength?: T_RelationshipStrength
    ruleset?: T_Ruleset
    includeMetadata?: boolean
}

export interface I_RelationshipMap {
    worldId: T_ObjectId
    center: T_ObjectId
    depth: 1 | 2 | 3
    relationships: T_Relationship[]
    connectedEntities: { entityId: T_ObjectId; entityType: T_EntityType; connections: number }[]
}

export interface I_RelationshipEvent {
    id: T_ObjectId
    relationshipId: T_ObjectId
    eventType: 'created' | 'strengthened' | 'weakened' | 'changed' | 'ended' | 'reconciled'
    description: string
    date: T_Timestamp
    impact?: string
}

export interface I_RelationshipStats {
    worldId: T_ObjectId
    total: number
    byType: Partial<Record<T_RelationType, number>>
    byRuleset: { generic: number; dnd_5e_24: number; aetherscape: number }
    directional: number
    bidirectional: number
    averageStrength: number
    strongRelationships: number
    brokenRelationships: number
    secretRelationships: number
    averageConnectionsPerEntity: number
    mostConnectedEntity?: { entityId: T_ObjectId; connections: number }
}

export interface I_RelationshipSuggestion {
    fromEntityId: T_ObjectId
    toEntityId: T_ObjectId
    suggestedTypes: T_RelationType[]
    reasoning: string
    confidence: number
    basedOnRuleset: T_Ruleset
    basedOnEntityTypes: { from: T_EntityType; to: T_EntityType }
}
