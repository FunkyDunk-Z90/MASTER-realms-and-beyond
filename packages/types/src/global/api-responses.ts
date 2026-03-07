import { I_Pagination, I_PaginationQuery } from './pagination'
import { T_ObjectId, T_Timestamp } from './globalIndex'

export interface I_FilterCriteria {
    field: string
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'regex'
    value: any
}

export interface I_SearchQuery {
    q: string
    fields?: string[]
    pagination?: I_PaginationQuery
    filters?: I_FilterCriteria[]
}

export interface I_SearchResults<T> {
    results: T[]
    relevanceScores: Record<string, number>
    total: number
}

export interface I_FileInfo {
    filename: string
    mimeType: string
    size: number
    url: string
    uploadedAt: T_Timestamp
    publicId?: string
}

export interface I_AuditLog {
    id: T_ObjectId
    entityType: string
    entityId: T_ObjectId
    userId: T_ObjectId
    action: 'create' | 'update' | 'delete' | 'read'
    changes?: {
        field: string
        oldValue: any
        newValue: any
    }[]
    ipAddress?: string
    timestamp: T_Timestamp
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
    pagination: I_Pagination
    timestamp: string
    requestId: string
}

export interface I_PaginationError {
    success: false
    error: {
        code: string
        message: string
        details?: Record<string, any>
        timestamp: string
        requestId: string
    }
}

export type T_PaginatedResponse<T> = I_PaginationResponse<T> | I_PaginationError

export interface I_BulkResponse {
    success: true
    processed: number
    succeeded: number
    failed: number
    results: Array<{
        id: string
        success: boolean
        message?: string
    }>
    timestamp: string
    requestId: string
}

export interface I_HealthCheckResponse {
    status: 'healthy' | 'degraded' | 'down'
    uptime: number
    timestamp: string
    checks: {
        database: 'ok' | 'down'
        memory: {
            heapUsed: number
            heapTotal: number
            external: number
            rss: number
        }
        cache?: 'ok' | 'down'
        [key: string]: any
    }
}

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

export interface I_AsyncOperationsResponse {
    operationId: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    progress?: number
    result?: any
    error?: string
    estimatedTime?: string
    timestamp: string
}

export type T_ApiErrorCode =
    | 'validation_error'
    | 'invalid_input'
    | 'invalid_credentials'
    | 'unauthorized'
    | 'forbidden'
    | 'not_found'
    | 'conflict'
    | 'already_exists'
    | 'rate_limited'
    | 'internal_error'
    | 'service_unavailable'
    | 'timeout'
    | 'token_expired'
    | 'token_invalid'
    | 'session_expired'
    | 'quota_exceeded'
    | 'subscription_required'
    | 'invalid_state'
    | 'operation_failed'

// export const ERROR_CODE_STATUS_MAP: Record<T_ApiErrorCode, number> = {
//     validation_error: 400,
//     invalid_input: 400,
//     invalid_credentials: 401,
//     unauthorized: 401,
//     forbidden: 403,
//     not_found: 404,
//     conflict: 409,
//     already_exists: 409,
//     rate_limited: 429,
//     internal_error: 500,
//     service_unavailable: 503,
//     timeout: 504,
//     token_expired: 401,
//     token_invalid: 401,
//     session_expired: 401,
//     quota_exceeded: 429,
//     subscription_required: 402,
//     invalid_state: 409,
//     operation_failed: 500,
// }

// Helpers

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
    pagination: I_Pagination,
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

// export function createError(
//     code: T_ApiErrorCode,
//     message: string,
//     requestId: string,
//     details?: Record<string, any>
// ): I_ApiError {
//     return {
//         success: false,
//         error: {
//             code,
//             message,
//             details,
//             timestamp: new Date().toISOString(),
//             requestId,
//         },
//     }
// }

// type guards

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
