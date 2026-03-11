import { z } from 'zod'
import { Z_ObjectId, Z_Timestamp } from './zod.common'

// ─── Shared Enums ─────────────────────────────────────────────────────────────

export const Z_SubscriptionStatus = z.enum([
    'active',
    'paused',
    'cancelled',
    'expired',
    'past_due',
])

export const Z_BillingCycle = z.enum(['monthly', 'quarterly', 'yearly'])

// ─── AetherScribe (user-level) ────────────────────────────────────────────────

export const Z_SubscriptionPlan = z.enum(['free', 'starter', 'pro', 'enterprise'])

export const Z_SubscriptionLimits = z.object({
    maxWorlds: z.number(),
    maxCharacters: z.number(),
    maxStorageGB: z.number(),
    maxCollaborators: z.number(),
    advancedFeatures: z.boolean(),
    apiAccess: z.boolean(),
    customDomain: z.boolean(),
    prioritySupport: z.boolean(),
})

const Z_BillingInfo = z.object({
    cycle: Z_BillingCycle,
    nextBillingDate: Z_Timestamp,
    amount: z.number(),
    currency: z.string(),
    autoRenew: z.boolean(),
})

export const Z_Subscription = z.object({
    id: Z_ObjectId,
    userId: Z_ObjectId,
    app: z.literal('aetherscribe'),
    plan: Z_SubscriptionPlan,
    status: Z_SubscriptionStatus,
    limits: Z_SubscriptionLimits,
    billing: Z_BillingInfo,
    startDate: Z_Timestamp,
    endDate: Z_Timestamp.optional(),
    cancelledAt: Z_Timestamp.optional(),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

export const Z_CreateSubscriptionRequest = z.object({
    plan: Z_SubscriptionPlan,
    billingCycle: Z_BillingCycle,
    paymentMethodId: z.string().optional(),
})

export const Z_UpdateSubscriptionRequest = z.object({
    plan: Z_SubscriptionPlan.optional(),
    billingCycle: Z_BillingCycle.optional(),
    autoRenew: z.boolean().optional(),
})

export const Z_CancelSubscriptionRequest = z.object({
    reason: z.string().optional(),
    feedback: z.string().optional(),
})

// ─── NexusServe (company-level) ───────────────────────────────────────────────

export const Z_NexusServePlan = z.enum(['trial', 'basic', 'professional', 'enterprise'])

export const Z_NexusServeSubscription = z.object({
    id: Z_ObjectId,
    companyId: Z_ObjectId,
    app: z.literal('nexusserve'),
    plan: Z_NexusServePlan,
    status: Z_SubscriptionStatus,
    billing: Z_BillingInfo,
    limits: z.object({
        maxLocations: z.number(),
        maxEmployees: z.number(),
        maxMenuItems: z.number(),
        advancedReporting: z.boolean(),
        apiAccess: z.boolean(),
    }),
    startDate: Z_Timestamp,
    endDate: Z_Timestamp.optional(),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type T_SubscriptionStatus = z.infer<typeof Z_SubscriptionStatus>
export type T_BillingCycle = z.infer<typeof Z_BillingCycle>
export type T_SubscriptionPlan = z.infer<typeof Z_SubscriptionPlan>
export type T_SubscriptionLimits = z.infer<typeof Z_SubscriptionLimits>
export type T_Subscription = z.infer<typeof Z_Subscription>
export type T_CreateSubscriptionRequest = z.infer<typeof Z_CreateSubscriptionRequest>
export type T_UpdateSubscriptionRequest = z.infer<typeof Z_UpdateSubscriptionRequest>
export type T_CancelSubscriptionRequest = z.infer<typeof Z_CancelSubscriptionRequest>
export type T_NexusServePlan = z.infer<typeof Z_NexusServePlan>
export type T_NexusServeSubscription = z.infer<typeof Z_NexusServeSubscription>
