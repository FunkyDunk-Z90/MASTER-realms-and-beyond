import { Schema, model, Types } from 'mongoose'
import { baseDocumentFields, addBaseIndexes, buildToClient } from './_baseSchema'

// ─── Document Interface ───────────────────────────────────────────────────────

export interface I_CampaignDoc {
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
    subCategory: string
    status: string
    synopsis?: string
    tone?: string
    startDate?: string
    endDate?: string
    participants?: { accountId: Types.ObjectId; characterId?: Types.ObjectId; role: string; joinedAt?: string }[]
    sessions?: {
        sessionNumber: number
        title?: string
        date?: string
        summary?: string
        notableEvents?: string[]
        lootAwarded?: string[]
        xpAwarded?: number
    }[]
    currentSessionNumber?: number
    hooks?: { title: string; description?: string }[]
    secrets?: string
    dmNotes?: string
    createdAt: Date
    updatedAt: Date
    toClient(): Record<string, unknown>
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const campaignSchema = new Schema<I_CampaignDoc>(
    {
        ...baseDocumentFields,
        subCategory: {
            type: String,
            enum: ['main_arc', 'side_arc', 'session_log', 'quest', 'encounter'],
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['planning', 'active', 'paused', 'completed', 'archived'],
            default: 'planning',
            index: true,
        },
        synopsis: String,
        tone: String,
        startDate: String,
        endDate: String,
        participants: [{
            accountId: Schema.Types.ObjectId,
            characterId: Schema.Types.ObjectId,
            role: String,
            joinedAt: String,
            _id: false,
        }],
        sessions: [{
            sessionNumber: Number,
            title: String,
            date: String,
            summary: String,
            notableEvents: [String],
            lootAwarded: [String],
            xpAwarded: Number,
            _id: false,
        }],
        currentSessionNumber: { type: Number, default: 0 },
        hooks: [{ title: String, description: String, _id: false }],
        secrets: String,
        dmNotes: String,
    },
    { timestamps: true }
)

campaignSchema.methods.toClient = buildToClient
addBaseIndexes(campaignSchema)
campaignSchema.index({ codexId: 1, subCategory: 1 })
campaignSchema.index({ codexId: 1, status: 1 })

const Campaign = model<I_CampaignDoc>('Campaign', campaignSchema)
export default Campaign
