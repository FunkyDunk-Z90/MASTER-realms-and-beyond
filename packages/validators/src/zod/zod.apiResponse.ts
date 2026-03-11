import { z } from 'zod'
import { Z_Timestamp, Z_ObjectId } from './zod.common'
import { Z_Pagination, Z_PaginationQuery } from './zod.pagination'

// ─── Filter Criteria ──────────────────────────────────────────────────────────

export const Z_FilterCriteria = z.object({
    field: z.string(),
    operator: z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'regex']),
    value: z.any(),
})

// ─── Search Query ─────────────────────────────────────────────────────────────

export const Z_SearchQuery = z.object({
    q: z.string(),
    fields: z.array(z.string()).optional(),
    pagination: Z_PaginationQuery.optional(),
    filters: z.array(Z_FilterCriteria).optional(),
})

// ─── File Info ────────────────────────────────────────────────────────────────

export const Z_FileInfo = z.object({
    filename: z.string(),
    mimeType: z.string(),
    size: z.number(),
    url: z.string(),
    uploadedAt: Z_Timestamp,
    publicId: z.string().optional(),
})

// ─── API Success ──────────────────────────────────────────────────────────────

export const Z_ApiSuccess = z.object({
    success: z.literal(true),
    data: z.unknown(),
    timestamp: z.string(),
    requestId: z.string(),
})

// ─── API Error ────────────────────────────────────────────────────────────────

export const Z_ApiError = z.object({
    success: z.literal(false),
    error: z.object({
        code: z.string(),
        message: z.string(),
        details: z.record(z.string(), z.any()).optional(),
        timestamp: z.string(),
        requestId: z.string(),
    }),
})

// ─── Pagination Response ──────────────────────────────────────────────────────

export const Z_PaginationResponse = z.object({
    success: z.literal(true),
    data: z.array(z.unknown()),
    pagination: Z_Pagination,
    timestamp: z.string(),
    requestId: z.string(),
})

// ─── Bulk Response ────────────────────────────────────────────────────────────

export const Z_BulkResponse = z.object({
    success: z.literal(true),
    processed: z.number(),
    succeeded: z.number(),
    failed: z.number(),
    results: z.array(
        z.object({
            id: z.string(),
            success: z.boolean(),
            message: z.string().optional(),
        })
    ),
    timestamp: z.string(),
    requestId: z.string(),
})

// ─── Health Check Response ────────────────────────────────────────────────────

export const Z_HealthCheckResponse = z.object({
    status: z.enum(['healthy', 'degraded', 'down']),
    uptime: z.number(),
    timestamp: z.string(),
    checks: z.object({
        database: z.enum(['ok', 'down']),
        memory: z.object({
            heapUsed: z.number(),
            heapTotal: z.number(),
            external: z.number(),
            rss: z.number(),
        }),
        cache: z.enum(['ok', 'down']).optional(),
    }),
})

// ─── Async Operations Response ────────────────────────────────────────────────

export const Z_AsyncOperationsResponse = z.object({
    operationId: z.string(),
    status: z.enum(['pending', 'processing', 'completed', 'failed']),
    progress: z.number().optional(),
    result: z.any().optional(),
    error: z.string().optional(),
    estimatedTime: z.string().optional(),
    timestamp: z.string(),
})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type T_FilterCriteria = z.infer<typeof Z_FilterCriteria>
export type T_SearchQuery = z.infer<typeof Z_SearchQuery>
export type T_FileInfo = z.infer<typeof Z_FileInfo>
export type T_ApiSuccess = z.infer<typeof Z_ApiSuccess>
export type T_ApiError = z.infer<typeof Z_ApiError>
export type T_PaginationResponse = z.infer<typeof Z_PaginationResponse>
export type T_BulkResponse = z.infer<typeof Z_BulkResponse>
export type T_HealthCheckResponse = z.infer<typeof Z_HealthCheckResponse>
export type T_AsyncOperationsResponse = z.infer<typeof Z_AsyncOperationsResponse>
