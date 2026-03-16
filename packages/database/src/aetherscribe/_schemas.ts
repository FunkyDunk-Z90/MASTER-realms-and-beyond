import { Schema } from 'mongoose'
import type { T_AetherscribeSubscriptionDoc } from '@rnb/validators'

// ─── Subscription sub-schema ──────────────────────────────────────────────────

export const aetherscribeSubscriptionSchema =
    new Schema<T_AetherscribeSubscriptionDoc>(
        {
            plan: {
                type: String,
                enum: ['free', 'starter', 'pro', 'enterprise'],
                required: true,
            },
            status: {
                type: String,
                enum: ['active', 'paused', 'cancelled', 'expired', 'past_due'],
                default: 'active',
            },
            startDate: { type: String, required: true },
            limits: {
                maxCodices: Number,
                maxStorageGB: Number,
                maxCollaborators: Number,
                advancedFeatures: Boolean,
                apiAccess: Boolean,
                customDomain: Boolean,
                prioritySupport: Boolean,
            },
        },
        { _id: false }
    )
