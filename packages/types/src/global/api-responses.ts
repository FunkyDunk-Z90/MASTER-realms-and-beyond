import { I_Pagination, I_PaginationQuery } from './pagination'
import { T_ObjectId, T_Timestamp } from './common/commonIndex'

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

export type T_PaginatedResponse<T> = I_PaginationResponse<T> | I_ApiError

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
