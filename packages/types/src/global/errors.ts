/**
 * @rnb/types - Global Error Types
 * Comprehensive error handling system for entire RnB ecosystem
 */

import type { T_Timestamp } from './common/commonIndex'

// ============================================================================
// ERROR CODES
// ============================================================================

export enum E_ErrorCode {
    // Client Errors (4xx)
    BAD_REQUEST = 'BAD_REQUEST',
    INVALID_INPUT = 'INVALID_INPUT',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
    INVALID_FORMAT = 'INVALID_FORMAT',
    INVALID_ENUM_VALUE = 'INVALID_ENUM_VALUE',

    UNAUTHORIZED = 'UNAUTHORIZED',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    TOKEN_INVALID = 'TOKEN_INVALID',
    SESSION_EXPIRED = 'SESSION_EXPIRED',
    INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

    FORBIDDEN = 'FORBIDDEN',
    ACCESS_DENIED = 'ACCESS_DENIED',
    RESOURCE_NOT_ACCESSIBLE = 'RESOURCE_NOT_ACCESSIBLE',

    NOT_FOUND = 'NOT_FOUND',
    ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND',
    WORLD_NOT_FOUND = 'WORLD_NOT_FOUND',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',

    CONFLICT = 'CONFLICT',
    DUPLICATE_ENTITY = 'DUPLICATE_ENTITY',
    ENTITY_ALREADY_EXISTS = 'ENTITY_ALREADY_EXISTS',
    INVALID_STATE = 'INVALID_STATE',
    STATE_CONFLICT = 'STATE_CONFLICT',

    RATE_LIMITED = 'RATE_LIMITED',
    TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
    QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
    STORAGE_QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',

    UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
    PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',
    SUBSCRIPTION_REQUIRED = 'SUBSCRIPTION_REQUIRED',

    // Server Errors (5xx)
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',

    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
    MAINTENANCE_MODE = 'MAINTENANCE_MODE',
    DEPENDENCY_UNAVAILABLE = 'DEPENDENCY_UNAVAILABLE',
    DATABASE_ERROR = 'DATABASE_ERROR',

    TIMEOUT = 'TIMEOUT',
    REQUEST_TIMEOUT = 'REQUEST_TIMEOUT',
    OPERATION_TIMEOUT = 'OPERATION_TIMEOUT',

    // Business Logic Errors
    OPERATION_FAILED = 'OPERATION_FAILED',
    OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
    OPERATION_NOT_SUPPORTED = 'OPERATION_NOT_SUPPORTED',
    INVALID_OPERATION = 'INVALID_OPERATION',

    BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
    CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',
    REFERENTIAL_INTEGRITY_VIOLATION = 'REFERENTIAL_INTEGRITY_VIOLATION',

    // Payment Errors
    PAYMENT_FAILED = 'PAYMENT_FAILED',
    PAYMENT_DECLINED = 'PAYMENT_DECLINED',
    INVALID_PAYMENT_METHOD = 'INVALID_PAYMENT_METHOD',
    FRAUD_DETECTED = 'FRAUD_DETECTED',
    INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',

    // File/Upload Errors
    FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',
    INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
    FILE_TOO_LARGE = 'FILE_TOO_LARGE',

    // Validation Errors
    INVALID_EMAIL = 'INVALID_EMAIL',
    INVALID_PASSWORD = 'INVALID_PASSWORD',
    INVALID_PHONE = 'INVALID_PHONE',
    INVALID_URL = 'INVALID_URL',

    // Relationship Errors
    RELATIONSHIP_CONFLICT = 'RELATIONSHIP_CONFLICT',
    INVALID_RELATIONSHIP = 'INVALID_RELATIONSHIP',

    // Data Consistency Errors
    DATA_INCONSISTENCY = 'DATA_INCONSISTENCY',
    STALE_DATA = 'STALE_DATA',
    OPTIMISTIC_LOCK_FAILED = 'OPTIMISTIC_LOCK_FAILED',

    // Import/Export Errors
    IMPORT_FAILED = 'IMPORT_FAILED',
    EXPORT_FAILED = 'EXPORT_FAILED',
    INVALID_FORMAT_FOR_IMPORT = 'INVALID_FORMAT_FOR_IMPORT',

    // External Service Errors
    EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
    PAYMENT_GATEWAY_ERROR = 'PAYMENT_GATEWAY_ERROR',
    EMAIL_SERVICE_ERROR = 'EMAIL_SERVICE_ERROR',
    STORAGE_SERVICE_ERROR = 'STORAGE_SERVICE_ERROR',
}

// ============================================================================
// HTTP STATUS CODE MAPPING
// ============================================================================

export const ERROR_CODE_STATUS_MAP: Record<E_ErrorCode, number> = {
    [E_ErrorCode.BAD_REQUEST]: 400,
    [E_ErrorCode.INVALID_INPUT]: 400,
    [E_ErrorCode.VALIDATION_ERROR]: 400,
    [E_ErrorCode.MISSING_REQUIRED_FIELD]: 400,
    [E_ErrorCode.INVALID_FORMAT]: 400,
    [E_ErrorCode.INVALID_ENUM_VALUE]: 400,
    [E_ErrorCode.UNAUTHORIZED]: 401,
    [E_ErrorCode.INVALID_CREDENTIALS]: 401,
    [E_ErrorCode.TOKEN_EXPIRED]: 401,
    [E_ErrorCode.TOKEN_INVALID]: 401,
    [E_ErrorCode.SESSION_EXPIRED]: 401,
    [E_ErrorCode.INSUFFICIENT_PERMISSIONS]: 403,
    [E_ErrorCode.FORBIDDEN]: 403,
    [E_ErrorCode.ACCESS_DENIED]: 403,
    [E_ErrorCode.RESOURCE_NOT_ACCESSIBLE]: 403,
    [E_ErrorCode.NOT_FOUND]: 404,
    [E_ErrorCode.ENTITY_NOT_FOUND]: 404,
    [E_ErrorCode.WORLD_NOT_FOUND]: 404,
    [E_ErrorCode.USER_NOT_FOUND]: 404,
    [E_ErrorCode.RESOURCE_NOT_FOUND]: 404,
    [E_ErrorCode.CONFLICT]: 409,
    [E_ErrorCode.DUPLICATE_ENTITY]: 409,
    [E_ErrorCode.ENTITY_ALREADY_EXISTS]: 409,
    [E_ErrorCode.INVALID_STATE]: 409,
    [E_ErrorCode.STATE_CONFLICT]: 409,
    [E_ErrorCode.RELATIONSHIP_CONFLICT]: 409,
    [E_ErrorCode.RATE_LIMITED]: 429,
    [E_ErrorCode.TOO_MANY_REQUESTS]: 429,
    [E_ErrorCode.QUOTA_EXCEEDED]: 429,
    [E_ErrorCode.STORAGE_QUOTA_EXCEEDED]: 429,
    [E_ErrorCode.UNPROCESSABLE_ENTITY]: 422,
    [E_ErrorCode.INVALID_OPERATION]: 422,
    [E_ErrorCode.INVALID_RELATIONSHIP]: 422,
    [E_ErrorCode.PAYMENT_REQUIRED]: 402,
    [E_ErrorCode.SUBSCRIPTION_REQUIRED]: 402,
    [E_ErrorCode.INTERNAL_SERVER_ERROR]: 500,
    [E_ErrorCode.INTERNAL_ERROR]: 500,
    [E_ErrorCode.UNKNOWN_ERROR]: 500,
    [E_ErrorCode.DATABASE_ERROR]: 500,
    [E_ErrorCode.OPERATION_FAILED]: 500,
    [E_ErrorCode.SERVICE_UNAVAILABLE]: 503,
    [E_ErrorCode.MAINTENANCE_MODE]: 503,
    [E_ErrorCode.DEPENDENCY_UNAVAILABLE]: 503,
    [E_ErrorCode.TIMEOUT]: 504,
    [E_ErrorCode.REQUEST_TIMEOUT]: 504,
    [E_ErrorCode.OPERATION_TIMEOUT]: 504,
    [E_ErrorCode.OPERATION_NOT_ALLOWED]: 400,
    [E_ErrorCode.OPERATION_NOT_SUPPORTED]: 400,
    [E_ErrorCode.BUSINESS_RULE_VIOLATION]: 400,
    [E_ErrorCode.CONSTRAINT_VIOLATION]: 409,
    [E_ErrorCode.REFERENTIAL_INTEGRITY_VIOLATION]: 409,
    [E_ErrorCode.PAYMENT_FAILED]: 402,
    [E_ErrorCode.PAYMENT_DECLINED]: 402,
    [E_ErrorCode.INVALID_PAYMENT_METHOD]: 400,
    [E_ErrorCode.FRAUD_DETECTED]: 403,
    [E_ErrorCode.INSUFFICIENT_FUNDS]: 402,
    [E_ErrorCode.FILE_UPLOAD_FAILED]: 400,
    [E_ErrorCode.INVALID_FILE_TYPE]: 400,
    [E_ErrorCode.FILE_TOO_LARGE]: 413,
    [E_ErrorCode.INVALID_EMAIL]: 400,
    [E_ErrorCode.INVALID_PASSWORD]: 400,
    [E_ErrorCode.INVALID_PHONE]: 400,
    [E_ErrorCode.INVALID_URL]: 400,
    [E_ErrorCode.DATA_INCONSISTENCY]: 500,
    [E_ErrorCode.STALE_DATA]: 409,
    [E_ErrorCode.OPTIMISTIC_LOCK_FAILED]: 409,
    [E_ErrorCode.IMPORT_FAILED]: 400,
    [E_ErrorCode.EXPORT_FAILED]: 500,
    [E_ErrorCode.INVALID_FORMAT_FOR_IMPORT]: 400,
    [E_ErrorCode.EXTERNAL_SERVICE_ERROR]: 502,
    [E_ErrorCode.PAYMENT_GATEWAY_ERROR]: 502,
    [E_ErrorCode.EMAIL_SERVICE_ERROR]: 502,
    [E_ErrorCode.STORAGE_SERVICE_ERROR]: 502,
}

// ============================================================================
// ERROR DETAIL TYPES
// ============================================================================

export interface I_ErrorDetail {
    code: E_ErrorCode
    message: string
    details?: Record<string, any>
    timestamp?: T_Timestamp
    requestId?: string
    path?: string
    method?: string
    statusCode?: number
}

export interface I_ValidationError extends I_ErrorDetail {
    code: E_ErrorCode.VALIDATION_ERROR
    fields?: {
        [fieldName: string]: {
            message: string
            value?: any
            constraint?: string
        }
    }
}

export interface I_BusinessRuleError extends I_ErrorDetail {
    code: E_ErrorCode.BUSINESS_RULE_VIOLATION
    rule: string
    context?: Record<string, any>
}

export interface I_PaymentError extends I_ErrorDetail {
    code: E_ErrorCode.PAYMENT_FAILED | E_ErrorCode.PAYMENT_DECLINED
    gatewayCode?: string
    gatewayMessage?: string
    retryable?: boolean
    retryAfter?: number
}

export interface I_ErrorResponse {
    success: false
    error: I_ErrorDetail
    timestamp: string
    requestId: string
}

export interface I_BatchErrorResponse {
    success: false
    errors: I_ErrorDetail[]
    failedCount: number
    successCount: number
    timestamp: string
    requestId: string
}

// ============================================================================
// ERROR FACTORY FUNCTIONS
// ============================================================================

export function createError(
    code: E_ErrorCode,
    message: string,
    requestId?: string,
    details?: Record<string, any>
): I_ErrorDetail {
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
): I_ValidationError {
    return {
        code: E_ErrorCode.VALIDATION_ERROR,
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
        code: E_ErrorCode.PAYMENT_FAILED,
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
        code: E_ErrorCode.BUSINESS_RULE_VIOLATION,
        message,
        rule,
        context,
        requestId,
        timestamp: Date.now(),
    }
}

// ============================================================================
// ERROR LOGGING
// ============================================================================

export interface I_ErrorLog {
    id: string
    code: E_ErrorCode
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

// ============================================================================
// ERROR RECOVERY STRATEGIES
// ============================================================================

export interface I_ErrorRecoveryStrategy {
    code: E_ErrorCode
    retryable: boolean
    maxRetries?: number
    retryDelay?: number
    strategy: 'exponential_backoff' | 'linear_backoff' | 'immediate'
    fallbackAction?: 'fail' | 'queue' | 'cache' | 'ignore'
}

export const ERROR_RECOVERY_STRATEGIES: Record<
    E_ErrorCode,
    I_ErrorRecoveryStrategy
> = {
    [E_ErrorCode.BAD_REQUEST]: {
        code: E_ErrorCode.BAD_REQUEST,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INVALID_INPUT]: {
        code: E_ErrorCode.INVALID_INPUT,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.VALIDATION_ERROR]: {
        code: E_ErrorCode.VALIDATION_ERROR,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.MISSING_REQUIRED_FIELD]: {
        code: E_ErrorCode.MISSING_REQUIRED_FIELD,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INVALID_FORMAT]: {
        code: E_ErrorCode.INVALID_FORMAT,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INVALID_ENUM_VALUE]: {
        code: E_ErrorCode.INVALID_ENUM_VALUE,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.UNAUTHORIZED]: {
        code: E_ErrorCode.UNAUTHORIZED,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INVALID_CREDENTIALS]: {
        code: E_ErrorCode.INVALID_CREDENTIALS,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.TOKEN_EXPIRED]: {
        code: E_ErrorCode.TOKEN_EXPIRED,
        retryable: true,
        maxRetries: 1,
        strategy: 'immediate',
        fallbackAction: 'fail',
    },
    [E_ErrorCode.TOKEN_INVALID]: {
        code: E_ErrorCode.TOKEN_INVALID,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.SESSION_EXPIRED]: {
        code: E_ErrorCode.SESSION_EXPIRED,
        retryable: true,
        maxRetries: 1,
        strategy: 'immediate',
    },
    [E_ErrorCode.INSUFFICIENT_PERMISSIONS]: {
        code: E_ErrorCode.INSUFFICIENT_PERMISSIONS,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.FORBIDDEN]: {
        code: E_ErrorCode.FORBIDDEN,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.ACCESS_DENIED]: {
        code: E_ErrorCode.ACCESS_DENIED,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.RESOURCE_NOT_ACCESSIBLE]: {
        code: E_ErrorCode.RESOURCE_NOT_ACCESSIBLE,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.NOT_FOUND]: {
        code: E_ErrorCode.NOT_FOUND,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.ENTITY_NOT_FOUND]: {
        code: E_ErrorCode.ENTITY_NOT_FOUND,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.WORLD_NOT_FOUND]: {
        code: E_ErrorCode.WORLD_NOT_FOUND,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.USER_NOT_FOUND]: {
        code: E_ErrorCode.USER_NOT_FOUND,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.RESOURCE_NOT_FOUND]: {
        code: E_ErrorCode.RESOURCE_NOT_FOUND,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.CONFLICT]: {
        code: E_ErrorCode.CONFLICT,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.DUPLICATE_ENTITY]: {
        code: E_ErrorCode.DUPLICATE_ENTITY,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.ENTITY_ALREADY_EXISTS]: {
        code: E_ErrorCode.ENTITY_ALREADY_EXISTS,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INVALID_STATE]: {
        code: E_ErrorCode.INVALID_STATE,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.STATE_CONFLICT]: {
        code: E_ErrorCode.STATE_CONFLICT,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.RATE_LIMITED]: {
        code: E_ErrorCode.RATE_LIMITED,
        retryable: true,
        maxRetries: 10,
        retryDelay: 5000,
        strategy: 'linear_backoff',
    },
    [E_ErrorCode.TOO_MANY_REQUESTS]: {
        code: E_ErrorCode.TOO_MANY_REQUESTS,
        retryable: true,
        maxRetries: 10,
        retryDelay: 5000,
        strategy: 'linear_backoff',
    },
    [E_ErrorCode.QUOTA_EXCEEDED]: {
        code: E_ErrorCode.QUOTA_EXCEEDED,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.STORAGE_QUOTA_EXCEEDED]: {
        code: E_ErrorCode.STORAGE_QUOTA_EXCEEDED,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.UNPROCESSABLE_ENTITY]: {
        code: E_ErrorCode.UNPROCESSABLE_ENTITY,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.PAYMENT_REQUIRED]: {
        code: E_ErrorCode.PAYMENT_REQUIRED,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.SUBSCRIPTION_REQUIRED]: {
        code: E_ErrorCode.SUBSCRIPTION_REQUIRED,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INTERNAL_SERVER_ERROR]: {
        code: E_ErrorCode.INTERNAL_SERVER_ERROR,
        retryable: true,
        maxRetries: 3,
        retryDelay: 1000,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INTERNAL_ERROR]: {
        code: E_ErrorCode.INTERNAL_ERROR,
        retryable: true,
        maxRetries: 3,
        retryDelay: 1000,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.UNKNOWN_ERROR]: {
        code: E_ErrorCode.UNKNOWN_ERROR,
        retryable: true,
        maxRetries: 3,
        retryDelay: 1000,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.SERVICE_UNAVAILABLE]: {
        code: E_ErrorCode.SERVICE_UNAVAILABLE,
        retryable: true,
        maxRetries: 5,
        retryDelay: 2000,
        strategy: 'exponential_backoff',
        fallbackAction: 'queue',
    },
    [E_ErrorCode.MAINTENANCE_MODE]: {
        code: E_ErrorCode.MAINTENANCE_MODE,
        retryable: true,
        maxRetries: 20,
        retryDelay: 10000,
        strategy: 'linear_backoff',
    },
    [E_ErrorCode.DEPENDENCY_UNAVAILABLE]: {
        code: E_ErrorCode.DEPENDENCY_UNAVAILABLE,
        retryable: true,
        maxRetries: 5,
        retryDelay: 2000,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.DATABASE_ERROR]: {
        code: E_ErrorCode.DATABASE_ERROR,
        retryable: true,
        maxRetries: 3,
        retryDelay: 500,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.TIMEOUT]: {
        code: E_ErrorCode.TIMEOUT,
        retryable: true,
        maxRetries: 3,
        retryDelay: 1000,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.REQUEST_TIMEOUT]: {
        code: E_ErrorCode.REQUEST_TIMEOUT,
        retryable: true,
        maxRetries: 3,
        retryDelay: 1000,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.OPERATION_TIMEOUT]: {
        code: E_ErrorCode.OPERATION_TIMEOUT,
        retryable: true,
        maxRetries: 2,
        retryDelay: 2000,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.OPERATION_FAILED]: {
        code: E_ErrorCode.OPERATION_FAILED,
        retryable: true,
        maxRetries: 2,
        retryDelay: 1000,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.OPERATION_NOT_ALLOWED]: {
        code: E_ErrorCode.OPERATION_NOT_ALLOWED,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.OPERATION_NOT_SUPPORTED]: {
        code: E_ErrorCode.OPERATION_NOT_SUPPORTED,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INVALID_OPERATION]: {
        code: E_ErrorCode.INVALID_OPERATION,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.BUSINESS_RULE_VIOLATION]: {
        code: E_ErrorCode.BUSINESS_RULE_VIOLATION,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.CONSTRAINT_VIOLATION]: {
        code: E_ErrorCode.CONSTRAINT_VIOLATION,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.REFERENTIAL_INTEGRITY_VIOLATION]: {
        code: E_ErrorCode.REFERENTIAL_INTEGRITY_VIOLATION,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.PAYMENT_FAILED]: {
        code: E_ErrorCode.PAYMENT_FAILED,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.PAYMENT_DECLINED]: {
        code: E_ErrorCode.PAYMENT_DECLINED,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INVALID_PAYMENT_METHOD]: {
        code: E_ErrorCode.INVALID_PAYMENT_METHOD,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.FRAUD_DETECTED]: {
        code: E_ErrorCode.FRAUD_DETECTED,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INSUFFICIENT_FUNDS]: {
        code: E_ErrorCode.INSUFFICIENT_FUNDS,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.FILE_UPLOAD_FAILED]: {
        code: E_ErrorCode.FILE_UPLOAD_FAILED,
        retryable: true,
        maxRetries: 2,
        retryDelay: 1000,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INVALID_FILE_TYPE]: {
        code: E_ErrorCode.INVALID_FILE_TYPE,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.FILE_TOO_LARGE]: {
        code: E_ErrorCode.FILE_TOO_LARGE,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INVALID_EMAIL]: {
        code: E_ErrorCode.INVALID_EMAIL,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INVALID_PASSWORD]: {
        code: E_ErrorCode.INVALID_PASSWORD,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INVALID_PHONE]: {
        code: E_ErrorCode.INVALID_PHONE,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INVALID_URL]: {
        code: E_ErrorCode.INVALID_URL,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.RELATIONSHIP_CONFLICT]: {
        code: E_ErrorCode.RELATIONSHIP_CONFLICT,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INVALID_RELATIONSHIP]: {
        code: E_ErrorCode.INVALID_RELATIONSHIP,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.DATA_INCONSISTENCY]: {
        code: E_ErrorCode.DATA_INCONSISTENCY,
        retryable: true,
        maxRetries: 3,
        retryDelay: 1000,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.STALE_DATA]: {
        code: E_ErrorCode.STALE_DATA,
        retryable: true,
        maxRetries: 2,
        retryDelay: 500,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.OPTIMISTIC_LOCK_FAILED]: {
        code: E_ErrorCode.OPTIMISTIC_LOCK_FAILED,
        retryable: true,
        maxRetries: 3,
        retryDelay: 100,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.IMPORT_FAILED]: {
        code: E_ErrorCode.IMPORT_FAILED,
        retryable: true,
        maxRetries: 2,
        retryDelay: 1000,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.EXPORT_FAILED]: {
        code: E_ErrorCode.EXPORT_FAILED,
        retryable: true,
        maxRetries: 2,
        retryDelay: 1000,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.INVALID_FORMAT_FOR_IMPORT]: {
        code: E_ErrorCode.INVALID_FORMAT_FOR_IMPORT,
        retryable: false,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.EXTERNAL_SERVICE_ERROR]: {
        code: E_ErrorCode.EXTERNAL_SERVICE_ERROR,
        retryable: true,
        maxRetries: 3,
        retryDelay: 2000,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.PAYMENT_GATEWAY_ERROR]: {
        code: E_ErrorCode.PAYMENT_GATEWAY_ERROR,
        retryable: true,
        maxRetries: 2,
        retryDelay: 1000,
        strategy: 'exponential_backoff',
    },
    [E_ErrorCode.EMAIL_SERVICE_ERROR]: {
        code: E_ErrorCode.EMAIL_SERVICE_ERROR,
        retryable: true,
        maxRetries: 3,
        retryDelay: 5000,
        strategy: 'exponential_backoff',
        fallbackAction: 'queue',
    },
    [E_ErrorCode.STORAGE_SERVICE_ERROR]: {
        code: E_ErrorCode.STORAGE_SERVICE_ERROR,
        retryable: true,
        maxRetries: 3,
        retryDelay: 2000,
        strategy: 'exponential_backoff',
    },
}
