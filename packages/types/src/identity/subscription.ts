// Subscription types derived from Zod schemas in @rnb/validators.

export type {
    T_SubscriptionStatus,
    T_BillingCycle,
    T_SubscriptionPlan,
    T_SubscriptionLimits,
    T_Subscription,
    T_CreateSubscriptionRequest,
    T_UpdateSubscriptionRequest,
    T_CancelSubscriptionRequest,
    T_NexusServePlan,
    T_NexusServeSubscription,
} from '@rnb/validators'

// ─── I_* aliases for backward compatibility ───────────────────────────────────

import type {
    T_SubscriptionLimits,
    T_Subscription,
    T_CreateSubscriptionRequest,
    T_UpdateSubscriptionRequest,
    T_CancelSubscriptionRequest,
    T_NexusServeSubscription,
    T_SubscriptionPlan,
} from '@rnb/validators'

export type I_SubscriptionLimits = T_SubscriptionLimits
export type I_Subscription = T_Subscription
export type I_CreateSubscriptionRequest = T_CreateSubscriptionRequest
export type I_UpdateSubscriptionRequest = T_UpdateSubscriptionRequest
export type I_CancelSubscriptionRequest = T_CancelSubscriptionRequest
export type I_NexusServeSubscription = T_NexusServeSubscription

// PLAN_LIMITS stays here — it is a data constant, not a Zod schema
export const PLAN_LIMITS: Record<T_SubscriptionPlan, T_SubscriptionLimits> = {
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
