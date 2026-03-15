import { Schema, model, Types } from 'mongoose'
import type { T_AetherscribeSubscriptionDoc } from '@rnb/validators'
import { aetherscribeSubscriptionSchema } from './_schemas'

// ─── Document interface ────────────────────────────────────────────────────────

export interface I_AetherscribeDoc {
    _id: Types.ObjectId
    identityId: Types.ObjectId
    username: string
    subscription: T_AetherscribeSubscriptionDoc
    status: 'active' | 'banned'
    createdAt: Date
    updatedAt: Date
}

// ─── Methods ──────────────────────────────────────────────────────────────────

export interface I_AetherscribeMethods {
    toClient(): Record<string, unknown>
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const aetherscribeSchema = new Schema<I_AetherscribeDoc, {}, I_AetherscribeMethods>(
    {
        identityId: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            index: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        subscription: { type: aetherscribeSubscriptionSchema, required: true },
        status: {
            type: String,
            enum: ['active', 'banned'],
            default: 'active',
        },
    },
    { timestamps: true }
)

// ─── toClient ─────────────────────────────────────────────────────────────────

aetherscribeSchema.methods.toClient = function () {
    const { _id, __v, ...rest } = this.toObject()
    return { ...rest, id: _id?.toString() }
}

// ─── Model ────────────────────────────────────────────────────────────────────

const AetherscribeProfile = model<I_AetherscribeDoc>(
    'AetherscribeProfile',
    aetherscribeSchema
)

export default AetherscribeProfile
