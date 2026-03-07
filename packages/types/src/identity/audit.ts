/**
 * @rnb/types - Identity Audit Types
 * Audit logging for security and compliance
 */

import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'

// ============================================================================
// AUDIT ACTION
// ============================================================================

export enum E_AuditAction {
    // Authentication
    LOGIN = 'login',
    LOGOUT = 'logout',
    LOGIN_FAILED = 'login_failed',
    LOGIN_2FA_ATTEMPT = 'login_2fa_attempt',
    LOGIN_2FA_SUCCESS = 'login_2fa_success',
    LOGIN_2FA_FAILED = 'login_2fa_failed',

    // Registration
    REGISTER = 'register',
    EMAIL_VERIFIED = 'email_verified',
    EMAIL_VERIFICATION_SENT = 'email_verification_sent',

    // Password
    PASSWORD_CHANGED = 'password_changed',
    PASSWORD_RESET_REQUESTED = 'password_reset_requested',
    PASSWORD_RESET = 'password_reset',
    PASSWORD_RESET_FAILED = 'password_reset_failed',
    PASSWORD_STRENGTH_CHECK = 'password_strength_check',

    // Profile
    PROFILE_UPDATED = 'profile_updated',
    AVATAR_CHANGED = 'avatar_changed',
    PREFERENCES_CHANGED = 'preferences_changed',
    PROFILE_DELETED = 'profile_deleted',

    // Session
    SESSION_CREATED = 'session_created',
    SESSION_TERMINATED = 'session_terminated',
    SESSION_EXPIRED = 'session_expired',
    MULTIPLE_SESSIONS_ACTIVE = 'multiple_sessions_active',
    SESSION_TIMEOUT = 'session_timeout',

    // Two-Factor Auth
    TWO_FA_ENABLED = 'two_fa_enabled',
    TWO_FA_DISABLED = 'two_fa_disabled',
    TWO_FA_METHOD_CHANGED = 'two_fa_method_changed',
    TWO_FA_BACKUP_CODES_GENERATED = 'two_fa_backup_codes_generated',

    // Permissions
    PERMISSION_GRANTED = 'permission_granted',
    PERMISSION_REVOKED = 'permission_revoked',
    ROLE_CHANGED = 'role_changed',
    ROLE_ASSIGNED = 'role_assigned',
    ROLE_REMOVED = 'role_removed',

    // Token
    TOKEN_ISSUED = 'token_issued',
    TOKEN_REFRESHED = 'token_refreshed',
    TOKEN_REVOKED = 'token_revoked',
    TOKEN_EXPIRED = 'token_expired',

    // Security
    SUSPICIOUS_ACTIVITY = 'suspicious_activity',
    BRUTE_FORCE_DETECTED = 'brute_force_detected',
    ACCOUNT_LOCKED = 'account_locked',
    ACCOUNT_UNLOCKED = 'account_unlocked',
    SUSPICIOUS_LOGIN_LOCATION = 'suspicious_login_location',
    SUSPICIOUS_LOGIN_DEVICE = 'suspicious_login_device',

    // Subscription
    SUBSCRIPTION_CREATED = 'subscription_created',
    SUBSCRIPTION_UPDATED = 'subscription_updated',
    SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
    SUBSCRIPTION_EXPIRED = 'subscription_expired',
    SUBSCRIPTION_DOWNGRADED = 'subscription_downgraded',
    SUBSCRIPTION_UPGRADED = 'subscription_upgraded',

    // Compliance
    TERMS_ACCEPTED = 'terms_accepted',
    PRIVACY_POLICY_ACCEPTED = 'privacy_policy_accepted',
    DATA_EXPORT_REQUESTED = 'data_export_requested',
    DATA_DELETION_REQUESTED = 'data_deletion_requested',
    DATA_DELETION_EXECUTED = 'data_deletion_executed',

    // API
    API_KEY_CREATED = 'api_key_created',
    API_KEY_REVOKED = 'api_key_revoked',
    API_QUOTA_CHANGED = 'api_quota_changed',

    // Access
    RESOURCE_ACCESSED = 'resource_accessed',
    RESOURCE_MODIFIED = 'resource_modified',
    RESOURCE_DELETED = 'resource_deleted',
    UNAUTHORIZED_ACCESS_ATTEMPT = 'unauthorized_access_attempt',

    // Collaboration
    COLLABORATOR_ADDED = 'collaborator_added',
    COLLABORATOR_REMOVED = 'collaborator_removed',
    COLLABORATOR_ROLE_CHANGED = 'collaborator_role_changed',
}

// ============================================================================
// AUDIT SEVERITY
// ============================================================================

export enum E_AuditSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

// ============================================================================
// AUDIT LOG ENTRY
// ============================================================================

export interface I_AuditLogEntry {
    id: T_ObjectId
    action: E_AuditAction
    severity: E_AuditSeverity

    userId: T_ObjectId
    targetUserId?: T_ObjectId // If action is on another user

    resourceType?: string
    resourceId?: T_ObjectId

    ipAddress: string
    userAgent?: string

    status: 'success' | 'failure'
    message?: string
    errorCode?: string
    errorMessage?: string

    changes?: {
        field: string
        oldValue: any
        newValue: any
    }[]

    metadata?: {
        location?: {
            country?: string
            city?: string
            latitude?: number
            longitude?: number
        }
        deviceInfo?: {
            type: 'mobile' | 'tablet' | 'desktop'
            os?: string
            browser?: string
        }
        mfaUsed?: boolean
        sessionId?: string
        [key: string]: any
    }

    timestamp: T_Timestamp
    createdAt: T_Timestamp
}

// ============================================================================
// AUDIT LOG QUERIES
// ============================================================================

export interface I_AuditLogFilter {
    userId?: T_ObjectId
    action?: E_AuditAction | E_AuditAction[]
    severity?: E_AuditSeverity | E_AuditSeverity[]
    status?: 'success' | 'failure'
    resourceType?: string
    resourceId?: T_ObjectId
    startDate?: T_Timestamp
    endDate?: T_Timestamp
    ipAddress?: string
    limit?: number
    offset?: number
}

export interface I_AuditLogResponse {
    success: boolean
    data: I_AuditLogEntry[]
    pagination: {
        total: number
        limit: number
        offset: number
        hasMore: boolean
    }
    timestamp: string
    requestId: string
}

// ============================================================================
// AUDIT STATISTICS
// ============================================================================

export interface I_AuditStats {
    period: {
        startDate: T_Timestamp
        endDate: T_Timestamp
    }

    totalEntries: number
    successRate: number
    failureRate: number

    byAction: {
        [action in E_AuditAction]?: {
            count: number
            successCount: number
            failureCount: number
        }
    }

    bySeverity: {
        low: number
        medium: number
        high: number
        critical: number
    }

    securityEvents: {
        suspiciousActivities: number
        bruteForceAttempts: number
        unauthorizedAccessAttempts: number
        accountLockouts: number
    }

    topActions: {
        action: E_AuditAction
        count: number
    }[]

    topFailedActions: {
        action: E_AuditAction
        count: number
    }[]
}

// ============================================================================
// SECURITY ALERT
// ============================================================================

export interface I_SecurityAlert {
    id: T_ObjectId
    userId: T_ObjectId
    type: string // e.g., "suspicious_login", "brute_force", "unauthorized_access"
    severity: E_AuditSeverity
    message: string

    triggerAction: E_AuditAction
    triggerCount?: number
    timeWindow?: number // milliseconds

    metadata?: {
        failedAttempts?: number
        ipAddresses?: string[]
        locations?: string[]
        devices?: string[]
        [key: string]: any
    }

    dismissed: boolean
    dismissedAt?: T_Timestamp
    dismissedBy?: T_ObjectId

    investigationNotes?: string
    actionTaken?: string

    createdAt: T_Timestamp
    resolvedAt?: T_Timestamp
}

// ============================================================================
// AUDIT CONFIGURATION
// ============================================================================

export interface I_AuditConfiguration {
    userId: T_ObjectId

    logRetention: {
        days: number
        archiveAfterDays: number
    }

    alertRules: {
        action: E_AuditAction
        severity: E_AuditSeverity
        enabled: boolean
        notifyEmail?: boolean
        notifyInApp?: boolean
    }[]

    sensitiveActions: {
        action: E_AuditAction
        requireAdditionalAuth?: boolean
        requireApproval?: boolean
        notifyAdmins?: boolean
    }[]

    riskThresholds: {
        failedLoginsThreshold: number
        timeWindowMinutes: number
        suspiciousLocationThreshold: number
    }

    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}

// ============================================================================
// COMPLIANCE REPORT
// ============================================================================

export interface I_ComplianceReport {
    id: T_ObjectId
    userId: T_ObjectId
    reportType: 'activity' | 'security' | 'access' | 'data_handling'

    period: {
        startDate: T_Timestamp
        endDate: T_Timestamp
    }

    summary: string
    findings: {
        category: string
        description: string
        severity: E_AuditSeverity
        recommendation?: string
    }[]

    auditTrail: I_AuditLogEntry[]
    statistics: I_AuditStats

    generatedAt: T_Timestamp
    generatedBy: T_ObjectId

    signed?: boolean
    signature?: string
    certifiedAt?: T_Timestamp
}

// ============================================================================
// AUDIT REQUEST TYPES
// ============================================================================

export interface I_GetAuditLogsRequest {
    userId?: T_ObjectId
    action?: E_AuditAction | E_AuditAction[]
    severity?: E_AuditSeverity | E_AuditSeverity[]
    status?: 'success' | 'failure'
    resourceType?: string
    resourceId?: T_ObjectId
    startDate?: T_Timestamp
    endDate?: T_Timestamp
    ipAddress?: string
    limit?: number
    offset?: number
}

export interface I_GetAuditStatsRequest {
    userId?: T_ObjectId
    startDate: T_Timestamp
    endDate: T_Timestamp
    includeByAction?: boolean
    includeSecurity?: boolean
}

export interface I_GetSecurityAlertsRequest {
    userId: T_ObjectId
    dismissed?: boolean
    severity?: E_AuditSeverity
    limit?: number
    offset?: number
}

export interface I_DismissSecurityAlertRequest {
    alertId: T_ObjectId
    notes?: string
}

export interface I_GenerateComplianceReportRequest {
    userId: T_ObjectId
    reportType: 'activity' | 'security' | 'access' | 'data_handling'
    startDate: T_Timestamp
    endDate: T_Timestamp
    includeDetails?: boolean
}

export interface I_ExportAuditLogsRequest {
    userId?: T_ObjectId
    startDate: T_Timestamp
    endDate: T_Timestamp
    format: 'csv' | 'json' | 'pdf'
    includeMetadata?: boolean
}
