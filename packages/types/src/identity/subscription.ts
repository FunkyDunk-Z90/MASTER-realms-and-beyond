/**
 * @rnb/types - Subscription Types
 *
 * RnB uses per-app subscriptions:
 *   - AetherScribe: tiered user plan (free → starter → pro → enterprise)
 *   - NexusServe: company-level plan
 *   - ByteBurger: free to use; monetised via transaction fees / loyalty
 */

import type { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'

// ============================================================================
// SHARED
// ============================================================================

export type T_SubscriptionStatus =
    | 'active'
    | 'paused'
    | 'cancelled'
    | 'expired'
    | 'past_due'

export type T_BillingCycle = 'monthly' | 'quarterly' | 'yearly'

// ============================================================================
// AETHERSCRIBE SUBSCRIPTION (user-level)
// ============================================================================

export type T_SubscriptionPlan = 'free' | 'starter' | 'pro' | 'enterprise'

export interface I_SubscriptionLimits {
    maxWorlds: number
    maxCharacters: number
    maxStorageGB: number
    maxCollaborators: number
    advancedFeatures: boolean
    apiAccess: boolean
    customDomain: boolean
    prioritySupport: boolean
}

export interface I_Subscription {
    id: T_ObjectId
    userId: T_ObjectId
    app: 'aetherscribe'
    plan: T_SubscriptionPlan
    status: T_SubscriptionStatus
    limits: I_SubscriptionLimits
    billing: {
        cycle: T_BillingCycle
        nextBillingDate: T_Timestamp
        amount: number
        currency: string
        autoRenew: boolean
    }
    startDate: T_Timestamp
    endDate?: T_Timestamp
    cancelledAt?: T_Timestamp
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}

export const PLAN_LIMITS: Record<T_SubscriptionPlan, I_SubscriptionLimits> = {
    free: {
        maxWorlds: 1,
        maxCharacters: 5,
        maxStorageGB: 1,
        maxCollaborators: 1,
        advancedFeatures: false,
        apiAccess: false,
        customDomain: false,
        prioritySupport: false,
    },
    starter: {
        maxWorlds: 5,
        maxCharacters: 50,
        maxStorageGB: 10,
        maxCollaborators: 2,
        advancedFeatures: true,
        apiAccess: false,
        customDomain: false,
        prioritySupport: false,
    },
    pro: {
        maxWorlds: 50,
        maxCharacters: 500,
        maxStorageGB: 100,
        maxCollaborators: 10,
        advancedFeatures: true,
        apiAccess: true,
        customDomain: true,
        prioritySupport: true,
    },
    enterprise: {
        maxWorlds: 500,
        maxCharacters: 5000,
        maxStorageGB: 1000,
        maxCollaborators: 100,
        advancedFeatures: true,
        apiAccess: true,
        customDomain: true,
        prioritySupport: true,
    },
}

export interface I_CreateSubscriptionRequest {
    plan: T_SubscriptionPlan
    billingCycle: T_BillingCycle
    paymentMethodId?: string
}

export interface I_UpdateSubscriptionRequest {
    plan?: T_SubscriptionPlan
    billingCycle?: T_BillingCycle
    autoRenew?: boolean
}

export interface I_CancelSubscriptionRequest {
    reason?: string
    feedback?: string
}

// ============================================================================
// NEXUSSERVE SUBSCRIPTION (company-level)
// ============================================================================

export type T_NexusServePlan = 'trial' | 'basic' | 'professional' | 'enterprise'

export interface I_NexusServeSubscription {
    id: T_ObjectId
    companyId: T_ObjectId
    app: 'nexusserve'
    plan: T_NexusServePlan
    status: T_SubscriptionStatus
    billing: {
        cycle: T_BillingCycle
        nextBillingDate: T_Timestamp
        amount: number
        currency: string
        autoRenew: boolean
    }
    limits: {
        maxLocations: number
        maxEmployees: number
        maxMenuItems: number
        advancedReporting: boolean
        apiAccess: boolean
    }
    startDate: T_Timestamp
    endDate?: T_Timestamp
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}
