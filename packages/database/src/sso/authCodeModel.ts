import { Schema, Types, model } from 'mongoose'

// ─── Interface ────────────────────────────────────────────────────────────────

export interface I_AuthCode {
    code: string
    userId: Types.ObjectId
    clientId: string
    redirectUri: string
    codeChallenge: string          // SHA256(code_verifier) — PKCE
    codeChallengeMethod: string    // Always 'S256'
    scopes: string[]
    expiresAt: Date
    createdAt?: Date
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const authCodeSchema = new Schema<I_AuthCode>(
    {
        code: { type: String, required: true, unique: true },
        userId: { type: Schema.Types.ObjectId, ref: 'Identity', required: true },
        clientId: { type: String, required: true },
        redirectUri: { type: String, required: true },
        codeChallenge: { type: String, required: true },
        codeChallengeMethod: { type: String, default: 'S256' },
        scopes: { type: [String], default: [] },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
)

// Auto-delete expired codes via MongoDB TTL index
authCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// ─── Model ────────────────────────────────────────────────────────────────────

export const AuthCode = model<I_AuthCode>('AuthCode', authCodeSchema)
export default AuthCode
