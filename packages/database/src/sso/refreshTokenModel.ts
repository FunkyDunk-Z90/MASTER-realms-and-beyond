import { Schema, Types, model } from 'mongoose'

// ─── Interface ────────────────────────────────────────────────────────────────

export interface I_RefreshToken {
    token: string
    userId: Types.ObjectId
    clientId: string
    scopes: string[]
    rotatedAt: Date | null         // set when this token is used (rotation)
    replacedBy: string | null      // the new token that replaced this one
    expiresAt: Date
    createdAt?: Date
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const refreshTokenSchema = new Schema<I_RefreshToken>(
    {
        token: { type: String, required: true, unique: true },
        userId: { type: Schema.Types.ObjectId, ref: 'Identity', required: true },
        clientId: { type: String, required: true },
        scopes: { type: [String], default: [] },
        rotatedAt: { type: Date, default: null },
        replacedBy: { type: String, default: null },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
)

// Auto-delete expired tokens via MongoDB TTL index
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// ─── Model ────────────────────────────────────────────────────────────────────

export const RefreshToken = model<I_RefreshToken>('RefreshToken', refreshTokenSchema)
export default RefreshToken
