/**
 * @rnb/types - Identity Audit Types
 * Audit logging for security and compliance
 */

import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'

// ============================================================================
// AUDIT ACTION
// ============================================================================

export type E_AuditAction =
    // Authentication
    | 'login'
    | 'logout'
    | 'login_failed'
    | 'login_2fa_attempt'
    | 'login_2fa_success'
    | 'login_2fa_failed'
    // Registration
    | 'register'
    | 'email_verified'
    | 'email_verification_sent'
    // Password
    | 'password_changed'
    | 'password_reset_requested'
    | 'password_reset'
    | 'password_reset_failed'
    | 'password_strength_check'
    // Profile
    | 'profile_updated'
    | 'avatar_changed'
    | 'preferences_changed'
    | 'profile_deleted'
    // Session
    | 'session_created'
    | 'session_terminated'
    | 'session_expired'
    | 'multiple_sessions_active'
    | 'session_timeout'
    // Two-Factor Auth
    | 'two_fa_enabled'
    | 'two_fa_disabled'
    | 'two_fa_method_changed'
    | 'two_fa_backup_codes_generated'
    // Permissions
    | 'permission_granted'
    | 'permission_revoked'
    | 'role_changed'
    | 'role_assigned'
    | 'role_removed'
    // Token
    | 'token_issued'
    | 'token_refreshed'
    | 'token_revoked'
    | 'token_expired'
    // Security
    | 'suspicious_activity'
    | 'brute_force_detected'
    | 'account_locked'
    | 'account_unlocked'
    | 'suspicious_login_location'
    | 'suspicious_login_device'
    // Subscription
    | 'subscription_created'
    | 'subscription_updated'
    | 'subscription_cancelled'
    | 'subscription_expired'
    | 'subscription_downgraded'
    | 'subscription_upgraded'
    // Compliance
    | 'terms_accepted'
    | 'privacy_policy_accepted'
    | 'data_export_requested'
    | 'data_deletion_requested'
    | 'data_deletion_executed'
    // API
    | 'api_key_created'
    | 'api_key_revoked'
    | 'api_quota_changed'
    // Access
    | 'resource_accessed'
    | 'resource_modified'
    | 'resource_deleted'
    | 'unauthorized_access_attempt'
    // Collaboration
    | 'collaborator_added'
    | 'collaborator_removed'
    | 'collaborator_role_changed'

// ============================================================================
// AUDIT SEVERITY
// ============================================================================

export type E_AuditSeverity = 'low' | 'medium' | 'high' | 'critical'

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
