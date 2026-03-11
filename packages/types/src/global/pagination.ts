// Pagination types derived from Zod schemas in @rnb/validators.

export type {
    T_PaginationQuery,
    T_Pagination,
} from '@rnb/validators'

// ─── I_* aliases for backward compatibility ───────────────────────────────────

import type { T_PaginationQuery, T_Pagination } from '@rnb/validators'

export type I_PaginationQuery = T_PaginationQuery
export type I_Pagination = T_Pagination

// Type guard kept here (runtime logic)
export function isPaginationQuery(value: any): value is T_PaginationQuery {
    return (
        typeof value === 'object' &&
        typeof value.limit === 'number' &&
        typeof value.offset === 'number'
    )
}
