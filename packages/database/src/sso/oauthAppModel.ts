import { Schema, model } from 'mongoose'

// ─── Interface ────────────────────────────────────────────────────────────────

export interface I_App {
    name: string
    clientId: string
    clientSecret: string | null    // null for public clients
    clientType: 'confidential' | 'public'
    redirectUris: string[]
    allowedScopes: string[]
    ownerName?: string             // third-party: contact name
    ownerEmail?: string            // third-party: contact email
    isFirstParty: boolean
    active: boolean
    createdAt?: Date
    updatedAt?: Date
}

/** @deprecated Use I_App */
export type I_OAuthApp = I_App

// ─── Schema ───────────────────────────────────────────────────────────────────

const appSchema = new Schema<I_App>(
    {
        name: { type: String, required: true },
        clientId: { type: String, required: true, unique: true },
        clientSecret: { type: String, default: null },
        clientType: {
            type: String,
            enum: ['confidential', 'public'],
            required: true,
        },
        redirectUris: [{ type: String }],
        allowedScopes: { type: [String], default: ['profile', 'email'] },
        ownerName: { type: String },
        ownerEmail: { type: String },
        isFirstParty: { type: Boolean, default: false },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
)

// ─── Model ────────────────────────────────────────────────────────────────────

export const App = model<I_App>('App', appSchema)

/** @deprecated Use App */
export const OAuthApp = App

export default App
