/**
 * @rnb/types — AetherScribe Relationship Types
 */

export type {
    T_RelationType,
    T_RelationshipStrength,
    T_Relationship,
    T_CreateRelationshipRequest,
    T_UpdateRelationshipRequest,
} from '@rnb/validators'

import type {
    T_RelationType,
    T_RelationshipStrength,
    T_Relationship,
} from '@rnb/validators'
import type { T_ObjectId } from '../global/common/commonIndex'

// ─── Aliases ──────────────────────────────────────────────────────────────────

export type E_RelationType = T_RelationType
export type RelationshipStrength = T_RelationshipStrength
export type I_Relationship = T_Relationship

// ─── Network ──────────────────────────────────────────────────────────────────

export interface I_RelationshipNetwork {
    entityId: T_ObjectId
    outgoing: T_Relationship[]
    incoming: T_Relationship[]
    connections: {
        directly: { count: number; types: Partial<Record<T_RelationType, number>> }
        twoDegreesAway: { count: number }
    }
}
