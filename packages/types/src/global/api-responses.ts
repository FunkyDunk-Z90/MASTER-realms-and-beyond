// Non-generic API response types are derived from Zod schemas in @rnb/validators.
// Generic types (I_ApiSuccess<T>, I_ApiError, etc.) are kept here because
// Zod cannot express TypeScript generics at runtime.

import type { T_Pagination } from '@rnb/validators'

export type {
    T_FilterCriteria,
    T_SearchQuery,
    T_FileInfo,
    T_ApiSuccess,
    T_ApiError,
    T_BulkResponse,
    T_HealthCheckResponse,
    T_AsyncOperationsResponse,
} from '@rnb/validators'

import type {
    T_FilterCriteria,
    T_FileInfo,
    T_BulkResponse,
    T_HealthCheckResponse,
    T_AsyncOperationsResponse,
} from '@rnb/validators'

// ─── I_* Aliases ──────────────────────────────────────────────────────────────

export type I_FilterCriteria = T_FilterCriteria
export type I_FileInfo = T_FileInfo
export type I_BulkResponse = T_BulkResponse
export type I_HealthCheckResponse = T_HealthCheckResponse
export type I_AsyncOperationsResponse = T_AsyncOperationsResponse

// ─── Generic Interfaces (kept here — Zod cannot express generics at runtime) ──

export interface I_SearchResults<T> {
    results: T[]
    relevanceScores: Record<string, number>
    total: number
}

export interface I_ApiSuccess<T> {
    success: true
    data: T
    timestamp: string
    requestId: string
}

export interface I_ApiError {
    success: false
    error: {
        code: string
        message: string
        details?: Record<string, any>
        timestamp: string
        requestId: string
    }
}

export type T_ApiResponse<T> = I_ApiSuccess<T> | I_ApiError

export interface I_PaginationResponse<T> {
    success: true
    data: T[]
    pagination: T_Pagination
    timestamp: string
    requestId: string
}

export type T_PaginatedResponse<T> = I_PaginationResponse<T> | I_ApiError

export interface I_ReadinessCheckResponse {
    ready: boolean
    reason?: string
    timestamp: string
}

export interface I_ListMetadata {
    total: number
    returned: number
    filters?: Record<string, any>
    sort?: {
        field: string
        order: 'asc' | 'desc'
    }
    timestamp: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function createSuccess<T>(data: T, requestId: string): I_ApiSuccess<T> {
    return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
        requestId,
    }
}

export function createPaginationSuccess<T>(
    data: T[],
    pagination: T_Pagination,
    requestId: string
): I_PaginationResponse<T> {
    return {
        success: true,
        data,
        pagination,
        timestamp: new Date().toISOString(),
        requestId,
    }
}

// ─── Type Guards ──────────────────────────────────────────────────────────────

export function isSuccess<T>(
    response: T_ApiResponse<unknown>
): response is I_ApiSuccess<T> {
    return response.success === true
}

export function isError(
    response: T_ApiResponse<unknown>
): response is I_ApiError {
    return response.success === false
}
