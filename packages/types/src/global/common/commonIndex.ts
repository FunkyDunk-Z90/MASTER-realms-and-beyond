// All primitive common types are derived from Zod schemas in @rnb/validators.

export type {
    T_ObjectId,
    T_Timestamp,
    T_Link,
    T_Breadcrumb,
    T_ColorVariant,
    T_Status,
    T_Metadata,
} from '@rnb/validators'

// ─── I_* aliases for backward compatibility ───────────────────────────────────

import type { T_Link, T_Breadcrumb } from '@rnb/validators'

export type I_Link = T_Link
export type I_Breadcrumb = T_Breadcrumb

// ─── Helpers (runtime logic stays here) ──────────────────────────────────────

import type { T_ObjectId, T_Timestamp } from '@rnb/validators'

export function createObjectId(id: string): T_ObjectId {
    return id as T_ObjectId
}

export function createTimestamp(date: Date | number): T_Timestamp {
    return typeof date === 'number' ? date : date.getTime()
}

export function isObjectId(value: any): value is T_ObjectId {
    return typeof value === 'string' && /^[a-f0-9]{24}$/.test(value)
}

export * from './contact'
export * from './editing'
export * from './metrics'
export * from './payment'
export * from './user'
