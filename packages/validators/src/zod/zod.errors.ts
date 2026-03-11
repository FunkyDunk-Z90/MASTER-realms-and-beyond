import { z } from 'zod'
import { Z_Timestamp } from './zod.common'

// ─── Error Code Enum ──────────────────────────────────────────────────────────

export const Z_ErrorCode = z.enum([
    'BAD_REQUEST',
    'INVALID_INPUT',
    'VALIDATION_ERROR',
    'MISSING_REQUIRED_FIELD',
    'INVALID_FORMAT',
    'INVALID_ENUM_VALUE',
    'UNAUTHORIZED',
    'INVALID_CREDENTIALS',
    'TOKEN_EXPIRED',
    'TOKEN_INVALID',
    'SESSION_EXPIRED',
    'INSUFFICIENT_PERMISSIONS',
    'FORBIDDEN',
    'ACCESS_DENIED',
    'RESOURCE_NOT_ACCESSIBLE',
    'NOT_FOUND',
    'ENTITY_NOT_FOUND',
    'WORLD_NOT_FOUND',
    'USER_NOT_FOUND',
    'RESOURCE_NOT_FOUND',
    'CONFLICT',
    'DUPLICATE_ENTITY',
    'ENTITY_ALREADY_EXISTS',
    'INVALID_STATE',
    'STATE_CONFLICT',
    'RATE_LIMITED',
    'TOO_MANY_REQUESTS',
    'QUOTA_EXCEEDED',
    'STORAGE_QUOTA_EXCEEDED',
    'UNPROCESSABLE_ENTITY',
    'PAYMENT_REQUIRED',
    'SUBSCRIPTION_REQUIRED',
    'INTERNAL_SERVER_ERROR',
    'INTERNAL_ERROR',
    'UNKNOWN_ERROR',
    'SERVICE_UNAVAILABLE',
    'MAINTENANCE_MODE',
    'DEPENDENCY_UNAVAILABLE',
    'DATABASE_ERROR',
    'TIMEOUT',
    'REQUEST_TIMEOUT',
    'OPERATION_TIMEOUT',
    'OPERATION_FAILED',
    'OPERATION_NOT_ALLOWED',
    'OPERATION_NOT_SUPPORTED',
    'INVALID_OPERATION',
    'BUSINESS_RULE_VIOLATION',
    'CONSTRAINT_VIOLATION',
    'REFERENTIAL_INTEGRITY_VIOLATION',
    'PAYMENT_FAILED',
    'PAYMENT_DECLINED',
    'INVALID_PAYMENT_METHOD',
    'FRAUD_DETECTED',
    'INSUFFICIENT_FUNDS',
    'FILE_UPLOAD_FAILED',
    'INVALID_FILE_TYPE',
    'FILE_TOO_LARGE',
    'INVALID_EMAIL',
    'INVALID_PASSWORD',
    'INVALID_PHONE',
    'INVALID_URL',
    'RELATIONSHIP_CONFLICT',
    'INVALID_RELATIONSHIP',
    'DATA_INCONSISTENCY',
    'STALE_DATA',
    'OPTIMISTIC_LOCK_FAILED',
    'IMPORT_FAILED',
    'EXPORT_FAILED',
    'INVALID_FORMAT_FOR_IMPORT',
    'EXTERNAL_SERVICE_ERROR',
    'PAYMENT_GATEWAY_ERROR',
    'EMAIL_SERVICE_ERROR',
    'STORAGE_SERVICE_ERROR',
])

// ─── Error Detail ─────────────────────────────────────────────────────────────

export const Z_ErrorDetail = z.object({
    code: Z_ErrorCode,
    message: z.string(),
    details: z.record(z.string(), z.any()).optional(),
    timestamp: Z_Timestamp.optional(),
    requestId: z.string().optional(),
    path: z.string().optional(),
    method: z.string().optional(),
    statusCode: z.number().optional(),
})

// ─── Validation Error ─────────────────────────────────────────────────────────

export const Z_ValidationError = Z_ErrorDetail.extend({
    code: z.literal('VALIDATION_ERROR'),
    fields: z
        .record(
            z.string(),
            z.object({
                message: z.string(),
                value: z.any().optional(),
                constraint: z.string().optional(),
            })
        )
        .optional(),
})

// ─── Error Response ───────────────────────────────────────────────────────────

export const Z_ErrorResponse = z.object({
    success: z.literal(false),
    error: Z_ErrorDetail,
    timestamp: z.string(),
    requestId: z.string(),
})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type T_ErrorCode = z.infer<typeof Z_ErrorCode>
export type T_ErrorDetail = z.infer<typeof Z_ErrorDetail>
export type T_ValidationError = z.infer<typeof Z_ValidationError>
export type T_ErrorResponse = z.infer<typeof Z_ErrorResponse>
