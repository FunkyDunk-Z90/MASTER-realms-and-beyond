import { T_ObjectId, T_Timestamp } from '../global/common/commonIndex'

export type T_SubscriptionPlan = 'free' | 'starter' | 'pro' | 'enterprise'

export type T_SubscriptionStatus =
    | 'active'
    | 'paused'
    | 'cancelled'
    | 'expired'
    | 'past_due'

export type T_BillingCycle = 'monthly' | 'quarterly' | 'yearly'

export interface I_SubscriptionLimits {
    maxWorlds: number
    maxCharacters: number
    maxStorageGB: number
    maxCollaborators: number
    advancedFeatures: boolean
    customDomain: boolean
    apiAccess: boolean
    prioritySupport: boolean
}

export interface I_Subscription {
    id: T_ObjectId
    userId: T_ObjectId
    plan: T_SubscriptionPlan
    status: T_SubscriptionStatus
    limits: I_SubscriptionLimits
    billing: {
        cycle: T_BillingCycle
        nextBillingDate: Date
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
