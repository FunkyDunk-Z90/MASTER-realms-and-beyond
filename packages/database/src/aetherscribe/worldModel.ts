import { Schema, model, Types } from 'mongoose'
import { baseDocumentFields, addBaseIndexes, buildToClient } from './_baseSchema'

// ─── Document Interface ───────────────────────────────────────────────────────

export interface I_WorldDoc {
    _id: Types.ObjectId
    codexId: Types.ObjectId
    accountId: Types.ObjectId
    worldId?: Types.ObjectId
    name: string
    slug: string
    description?: string
    notes?: string
    tags: string[]
    isPrivate: boolean
    version: number
    primaryRuleset: string
    supportedRulesets: string[]
    visibility: string
    coverImageUrl?: string
    bannerImageUrl?: string
    toneDifficulty?: string
    era?: string
    magicLevel?: string
    techLevel?: string
    cosmologyNotes?: string
    planes?: { name: string; description?: string; access?: string }[]
    creationMyth?: string
    calendarNotes?: string
    months?: { name: string; days: number; season?: string }[]
    daysPerWeek?: number
    specialDays?: { name: string; description?: string }[]
    geographyNotes?: string
    continents?: { name: string; description?: string; climate?: string }[]
    climates?: string[]
    languages?: { name: string; script?: string; speakers?: string; notes?: string }[]
    collaborators?: { accountId: Types.ObjectId; role: string; addedAt: string }[]
    createdAt: Date
    updatedAt: Date
    toClient(): Record<string, unknown>
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const worldSchema = new Schema<I_WorldDoc>(
    {
        ...baseDocumentFields,
        primaryRuleset: { type: String, default: 'generic' },
        supportedRulesets: { type: [String], default: [] },
        visibility: { type: String, enum: ['private', 'friends_only', 'public'], default: 'private' },
        coverImageUrl: String,
        bannerImageUrl: String,
        toneDifficulty: { type: String, enum: ['light', 'balanced', 'dark', 'grimdark'] },
        era: String,
        magicLevel: { type: String, enum: ['none', 'low', 'medium', 'high', 'wild'] },
        techLevel: String,
        cosmologyNotes: String,
        planes: [{ name: String, description: String, access: String, _id: false }],
        creationMyth: String,
        calendarNotes: String,
        months: [{ name: String, days: Number, season: String, _id: false }],
        daysPerWeek: Number,
        specialDays: [{ name: String, description: String, _id: false }],
        geographyNotes: String,
        continents: [{ name: String, description: String, climate: String, _id: false }],
        climates: [String],
        languages: [{ name: String, script: String, speakers: String, notes: String, _id: false }],
        collaborators: [{
            accountId: Schema.Types.ObjectId,
            role: String,
            addedAt: String,
            _id: false,
        }],
    },
    { timestamps: true }
)

worldSchema.methods.toClient = buildToClient
addBaseIndexes(worldSchema)

const World = model<I_WorldDoc>('World', worldSchema)
export default World
