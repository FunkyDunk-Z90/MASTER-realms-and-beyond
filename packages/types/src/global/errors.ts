/**
 * @rnb/types - Global Error Types
 * Comprehensive error handling system for entire RnB ecosystem
 *
 * Core error types (T_ErrorCode, T_ErrorDetail, T_ValidationError, T_ErrorResponse)
 * are derived from Zod schemas in @rnb/validators.
 * Runtime constants and extended interfaces live here.
 */

import type { T_Timestamp } from './common/commonIndex'

export type {
    T_ErrorCode,
    T_ErrorDetail,
    T_ValidationError,
    T_ErrorResponse,
} from '@rnb/validators'

import type { T_ErrorCode, T_ErrorDetail, T_ValidationError } from '@rnb/validators'

// ─── E_* Alias for backward compatibility ─────────────────────────────────────

export type E_ErrorCode = T_ErrorCode

// ─── I_* Aliases ──────────────────────────────────────────────────────────────

export type I_ErrorDetail = T_ErrorDetail
export type I_ValidationError = T_ValidationError

// ─── Extended Error Types (not in validators) ──────────────────────────────────

export interface I_BusinessRuleError extends T_ErrorDetail {
    code: 'BUSINESS_RULE_VIOLATION'
    rule: string
    context?: Record<string, any>
}

export interface I_PaymentError extends T_ErrorDetail {
    code: 'PAYMENT_FAILED' | 'PAYMENT_DECLINED'
    gatewayCode?: string
    gatewayMessage?: string
    retryable?: boolean
    retryAfter?: number
}

export interface I_ErrorResponse {
    success: false
    error: T_ErrorDetail
    timestamp: string
    requestId: string
}

export interface I_BatchErrorResponse {
    success: false
    errors: T_ErrorDetail[]
    failedCount: number
    successCount: number
    timestamp: string
    requestId: string
}

export interface I_ErrorLog {
    id: string
    code: T_ErrorCode
    message: string
    stack?: string
    context?: {
        userId?: string
        worldId?: string
        entityId?: string
        orderId?: string
        [key: string]: any
    }
    severity: 'low' | 'medium' | 'high' | 'critical'
    resolved: boolean
    resolvedAt?: T_Timestamp
    createdAt: T_Timestamp
}

export interface I_ErrorRecoveryStrategy {
    code: T_ErrorCode
    retryable: boolean
    maxRetries?: number
    retryDelay?: number
    strategy: 'exponential_backoff' | 'linear_backoff' | 'immediate'
    fallbackAction?: 'fail' | 'queue' | 'cache' | 'ignore'
}

// ─── HTTP Status Code Map ──────────────────────────────────────────────────────

export const ERROR_CODE_STATUS_MAP: Record<T_ErrorCode, number> = {
    BAD_REQUEST: 400,
    INVALID_INPUT: 400,
    VALIDATION_ERROR: 400,
    MISSING_REQUIRED_FIELD: 400,
    INVALID_FORMAT: 400,
    INVALID_ENUM_VALUE: 400,
    UNAUTHORIZED: 401,
    INVALID_CREDENTIALS: 401,
    TOKEN_EXPIRED: 401,
    TOKEN_INVALID: 401,
    SESSION_EXPIRED: 401,
    INSUFFICIENT_PERMISSIONS: 403,
    FORBIDDEN: 403,
    ACCESS_DENIED: 403,
    RESOURCE_NOT_ACCESSIBLE: 403,
    NOT_FOUND: 404,
    ENTITY_NOT_FOUND: 404,
    WORLD_NOT_FOUND: 404,
    USER_NOT_FOUND: 404,
    RESOURCE_NOT_FOUND: 404,
    CONFLICT: 409,
    DUPLICATE_ENTITY: 409,
    ENTITY_ALREADY_EXISTS: 409,
    INVALID_STATE: 409,
    STATE_CONFLICT: 409,
    RELATIONSHIP_CONFLICT: 409,
    RATE_LIMITED: 429,
    TOO_MANY_REQUESTS: 429,
    QUOTA_EXCEEDED: 429,
    STORAGE_QUOTA_EXCEEDED: 429,
    UNPROCESSABLE_ENTITY: 422,
    INVALID_OPERATION: 422,
    INVALID_RELATIONSHIP: 422,
    PAYMENT_REQUIRED: 402,
    SUBSCRIPTION_REQUIRED: 402,
    INTERNAL_SERVER_ERROR: 500,
    INTERNAL_ERROR: 500,
    UNKNOWN_ERROR: 500,
    DATABASE_ERROR: 500,
    OPERATION_FAILED: 500,
    SERVICE_UNAVAILABLE: 503,
    MAINTENANCE_MODE: 503,
    DEPENDENCY_UNAVAILABLE: 503,
    TIMEOUT: 504,
    REQUEST_TIMEOUT: 504,
    OPERATION_TIMEOUT: 504,
    OPERATION_NOT_ALLOWED: 400,
    OPERATION_NOT_SUPPORTED: 400,
    BUSINESS_RULE_VIOLATION: 400,
    CONSTRAINT_VIOLATION: 409,
    REFERENTIAL_INTEGRITY_VIOLATION: 409,
    PAYMENT_FAILED: 402,
    PAYMENT_DECLINED: 402,
    INVALID_PAYMENT_METHOD: 400,
    FRAUD_DETECTED: 403,
    INSUFFICIENT_FUNDS: 402,
    FILE_UPLOAD_FAILED: 400,
    INVALID_FILE_TYPE: 400,
    FILE_TOO_LARGE: 413,
    INVALID_EMAIL: 400,
    INVALID_PASSWORD: 400,
    INVALID_PHONE: 400,
    INVALID_URL: 400,
    DATA_INCONSISTENCY: 500,
    STALE_DATA: 409,
    OPTIMISTIC_LOCK_FAILED: 409,
    IMPORT_FAILED: 400,
    EXPORT_FAILED: 500,
    INVALID_FORMAT_FOR_IMPORT: 400,
    EXTERNAL_SERVICE_ERROR: 502,
    PAYMENT_GATEWAY_ERROR: 502,
    EMAIL_SERVICE_ERROR: 502,
    STORAGE_SERVICE_ERROR: 502,
}

// ─── Recovery Strategies ──────────────────────────────────────────────────────

export const ERROR_RECOVERY_STRATEGIES: Record<T_ErrorCode, I_ErrorRecoveryStrategy> = {
    BAD_REQUEST: { code: 'BAD_REQUEST', retryable: false, strategy: 'exponential_backoff' },
    INVALID_INPUT: { code: 'INVALID_INPUT', retryable: false, strategy: 'exponential_backoff' },
    VALIDATION_ERROR: { code: 'VALIDATION_ERROR', retryable: false, strategy: 'exponential_backoff' },
    MISSING_REQUIRED_FIELD: { code: 'MISSING_REQUIRED_FIELD', retryable: false, strategy: 'exponential_backoff' },
    INVALID_FORMAT: { code: 'INVALID_FORMAT', retryable: false, strategy: 'exponential_backoff' },
    INVALID_ENUM_VALUE: { code: 'INVALID_ENUM_VALUE', retryable: false, strategy: 'exponential_backoff' },
    UNAUTHORIZED: { code: 'UNAUTHORIZED', retryable: false, strategy: 'exponential_backoff' },
    INVALID_CREDENTIALS: { code: 'INVALID_CREDENTIALS', retryable: false, strategy: 'exponential_backoff' },
    TOKEN_EXPIRED: { code: 'TOKEN_EXPIRED', retryable: true, maxRetries: 1, strategy: 'immediate', fallbackAction: 'fail' },
    TOKEN_INVALID: { code: 'TOKEN_INVALID', retryable: false, strategy: 'exponential_backoff' },
    SESSION_EXPIRED: { code: 'SESSION_EXPIRED', retryable: true, maxRetries: 1, strategy: 'immediate' },
    INSUFFICIENT_PERMISSIONS: { code: 'INSUFFICIENT_PERMISSIONS', retryable: false, strategy: 'exponential_backoff' },
    FORBIDDEN: { code: 'FORBIDDEN', retryable: false, strategy: 'exponential_backoff' },
    ACCESS_DENIED: { code: 'ACCESS_DENIED', retryable: false, strategy: 'exponential_backoff' },
    RESOURCE_NOT_ACCESSIBLE: { code: 'RESOURCE_NOT_ACCESSIBLE', retryable: false, strategy: 'exponential_backoff' },
    NOT_FOUND: { code: 'NOT_FOUND', retryable: false, strategy: 'exponential_backoff' },
    ENTITY_NOT_FOUND: { code: 'ENTITY_NOT_FOUND', retryable: false, strategy: 'exponential_backoff' },
    WORLD_NOT_FOUND: { code: 'WORLD_NOT_FOUND', retryable: false, strategy: 'exponential_backoff' },
    USER_NOT_FOUND: { code: 'USER_NOT_FOUND', retryable: false, strategy: 'exponential_backoff' },
    RESOURCE_NOT_FOUND: { code: 'RESOURCE_NOT_FOUND', retryable: false, strategy: 'exponential_backoff' },
    CONFLICT: { code: 'CONFLICT', retryable: false, strategy: 'exponential_backoff' },
    DUPLICATE_ENTITY: { code: 'DUPLICATE_ENTITY', retryable: false, strategy: 'exponential_backoff' },
    ENTITY_ALREADY_EXISTS: { code: 'ENTITY_ALREADY_EXISTS', retryable: false, strategy: 'exponential_backoff' },
    INVALID_STATE: { code: 'INVALID_STATE', retryable: false, strategy: 'exponential_backoff' },
    STATE_CONFLICT: { code: 'STATE_CONFLICT', retryable: false, strategy: 'exponential_backoff' },
    RATE_LIMITED: { code: 'RATE_LIMITED', retryable: true, maxRetries: 10, retryDelay: 5000, strategy: 'linear_backoff' },
    TOO_MANY_REQUESTS: { code: 'TOO_MANY_REQUESTS', retryable: true, maxRetries: 10, retryDelay: 5000, strategy: 'linear_backoff' },
    QUOTA_EXCEEDED: { code: 'QUOTA_EXCEEDED', retryable: false, strategy: 'exponential_backoff' },
    STORAGE_QUOTA_EXCEEDED: { code: 'STORAGE_QUOTA_EXCEEDED', retryable: false, strategy: 'exponential_backoff' },
    UNPROCESSABLE_ENTITY: { code: 'UNPROCESSABLE_ENTITY', retryable: false, strategy: 'exponential_backoff' },
    PAYMENT_REQUIRED: { code: 'PAYMENT_REQUIRED', retryable: false, strategy: 'exponential_backoff' },
    SUBSCRIPTION_REQUIRED: { code: 'SUBSCRIPTION_REQUIRED', retryable: false, strategy: 'exponential_backoff' },
    INTERNAL_SERVER_ERROR: { code: 'INTERNAL_SERVER_ERROR', retryable: true, maxRetries: 3, retryDelay: 1000, strategy: 'exponential_backoff' },
    INTERNAL_ERROR: { code: 'INTERNAL_ERROR', retryable: true, maxRetries: 3, retryDelay: 1000, strategy: 'exponential_backoff' },
    UNKNOWN_ERROR: { code: 'UNKNOWN_ERROR', retryable: true, maxRetries: 3, retryDelay: 1000, strategy: 'exponential_backoff' },
    SERVICE_UNAVAILABLE: { code: 'SERVICE_UNAVAILABLE', retryable: true, maxRetries: 5, retryDelay: 2000, strategy: 'exponential_backoff', fallbackAction: 'queue' },
    MAINTENANCE_MODE: { code: 'MAINTENANCE_MODE', retryable: true, maxRetries: 20, retryDelay: 10000, strategy: 'linear_backoff' },
    DEPENDENCY_UNAVAILABLE: { code: 'DEPENDENCY_UNAVAILABLE', retryable: true, maxRetries: 5, retryDelay: 2000, strategy: 'exponential_backoff' },
    DATABASE_ERROR: { code: 'DATABASE_ERROR', retryable: true, maxRetries: 3, retryDelay: 500, strategy: 'exponential_backoff' },
    TIMEOUT: { code: 'TIMEOUT', retryable: true, maxRetries: 3, retryDelay: 1000, strategy: 'exponential_backoff' },
    REQUEST_TIMEOUT: { code: 'REQUEST_TIMEOUT', retryable: true, maxRetries: 3, retryDelay: 1000, strategy: 'exponential_backoff' },
    OPERATION_TIMEOUT: { code: 'OPERATION_TIMEOUT', retryable: true, maxRetries: 2, retryDelay: 2000, strategy: 'exponential_backoff' },
    OPERATION_FAILED: { code: 'OPERATION_FAILED', retryable: true, maxRetries: 2, retryDelay: 1000, strategy: 'exponential_backoff' },
    OPERATION_NOT_ALLOWED: { code: 'OPERATION_NOT_ALLOWED', retryable: false, strategy: 'exponential_backoff' },
    OPERATION_NOT_SUPPORTED: { code: 'OPERATION_NOT_SUPPORTED', retryable: false, strategy: 'exponential_backoff' },
    INVALID_OPERATION: { code: 'INVALID_OPERATION', retryable: false, strategy: 'exponential_backoff' },
    BUSINESS_RULE_VIOLATION: { code: 'BUSINESS_RULE_VIOLATION', retryable: false, strategy: 'exponential_backoff' },
    CONSTRAINT_VIOLATION: { code: 'CONSTRAINT_VIOLATION', retryable: false, strategy: 'exponential_backoff' },
    REFERENTIAL_INTEGRITY_VIOLATION: { code: 'REFERENTIAL_INTEGRITY_VIOLATION', retryable: false, strategy: 'exponential_backoff' },
    PAYMENT_FAILED: { code: 'PAYMENT_FAILED', retryable: false, strategy: 'exponential_backoff' },
    PAYMENT_DECLINED: { code: 'PAYMENT_DECLINED', retryable: false, strategy: 'exponential_backoff' },
    INVALID_PAYMENT_METHOD: { code: 'INVALID_PAYMENT_METHOD', retryable: false, strategy: 'exponential_backoff' },
    FRAUD_DETECTED: { code: 'FRAUD_DETECTED', retryable: false, strategy: 'exponential_backoff' },
    INSUFFICIENT_FUNDS: { code: 'INSUFFICIENT_FUNDS', retryable: false, strategy: 'exponential_backoff' },
    FILE_UPLOAD_FAILED: { code: 'FILE_UPLOAD_FAILED', retryable: true, maxRetries: 2, retryDelay: 1000, strategy: 'exponential_backoff' },
    INVALID_FILE_TYPE: { code: 'INVALID_FILE_TYPE', retryable: false, strategy: 'exponential_backoff' },
    FILE_TOO_LARGE: { code: 'FILE_TOO_LARGE', retryable: false, strategy: 'exponential_backoff' },
    INVALID_EMAIL: { code: 'INVALID_EMAIL', retryable: false, strategy: 'exponential_backoff' },
    INVALID_PASSWORD: { code: 'INVALID_PASSWORD', retryable: false, strategy: 'exponential_backoff' },
    INVALID_PHONE: { code: 'INVALID_PHONE', retryable: false, strategy: 'exponential_backoff' },
    INVALID_URL: { code: 'INVALID_URL', retryable: false, strategy: 'exponential_backoff' },
    RELATIONSHIP_CONFLICT: { code: 'RELATIONSHIP_CONFLICT', retryable: false, strategy: 'exponential_backoff' },
    INVALID_RELATIONSHIP: { code: 'INVALID_RELATIONSHIP', retryable: false, strategy: 'exponential_backoff' },
    DATA_INCONSISTENCY: { code: 'DATA_INCONSISTENCY', retryable: true, maxRetries: 3, retryDelay: 1000, strategy: 'exponential_backoff' },
    STALE_DATA: { code: 'STALE_DATA', retryable: true, maxRetries: 2, retryDelay: 500, strategy: 'exponential_backoff' },
    OPTIMISTIC_LOCK_FAILED: { code: 'OPTIMISTIC_LOCK_FAILED', retryable: true, maxRetries: 3, retryDelay: 100, strategy: 'exponential_backoff' },
    IMPORT_FAILED: { code: 'IMPORT_FAILED', retryable: true, maxRetries: 2, retryDelay: 1000, strategy: 'exponential_backoff' },
    EXPORT_FAILED: { code: 'EXPORT_FAILED', retryable: true, maxRetries: 2, retryDelay: 1000, strategy: 'exponential_backoff' },
    INVALID_FORMAT_FOR_IMPORT: { code: 'INVALID_FORMAT_FOR_IMPORT', retryable: false, strategy: 'exponential_backoff' },
    EXTERNAL_SERVICE_ERROR: { code: 'EXTERNAL_SERVICE_ERROR', retryable: true, maxRetries: 3, retryDelay: 2000, strategy: 'exponential_backoff' },
    PAYMENT_GATEWAY_ERROR: { code: 'PAYMENT_GATEWAY_ERROR', retryable: true, maxRetries: 2, retryDelay: 1000, strategy: 'exponential_backoff' },
    EMAIL_SERVICE_ERROR: { code: 'EMAIL_SERVICE_ERROR', retryable: true, maxRetries: 3, retryDelay: 5000, strategy: 'exponential_backoff', fallbackAction: 'queue' },
    STORAGE_SERVICE_ERROR: { code: 'STORAGE_SERVICE_ERROR', retryable: true, maxRetries: 3, retryDelay: 2000, strategy: 'exponential_backoff' },
}

// ─── Factory Functions ─────────────────────────────────────────────────────────

export function createError(
    code: T_ErrorCode,
    message: string,
    requestId?: string,
    details?: Record<string, any>
): T_ErrorDetail {
    return {
        code,
        message,
        requestId,
        details,
        timestamp: Date.now(),
    }
}

export function createValidationError(
    fields: { [fieldName: string]: { message: string; value?: any } },
    requestId?: string
): T_ValidationError {
    return {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        fields,
        requestId,
        timestamp: Date.now(),
    }
}

export function createPaymentError(
    message: string,
    gatewayCode?: string,
    retryable: boolean = false,
    requestId?: string
): I_PaymentError {
    return {
        code: 'PAYMENT_FAILED',
        message,
        gatewayCode,
        retryable,
        requestId,
        timestamp: Date.now(),
    }
}

export function createBusinessRuleError(
    rule: string,
    message: string,
    context?: Record<string, any>,
    requestId?: string
): I_BusinessRuleError {
    return {
        code: 'BUSINESS_RULE_VIOLATION',
        message,
        rule,
        context,
        requestId,
        timestamp: Date.now(),
    }
}
