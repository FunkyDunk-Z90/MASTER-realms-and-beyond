import { Schema } from 'mongoose'

// ─── Shared base fields for all content documents ─────────────────────────────
// Call this function to get a base object to spread into content schemas.

export const baseDocumentFields = {
    codexId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    accountId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    worldId: {
        type: Schema.Types.ObjectId,
        index: true,
        default: undefined,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    description: { type: String, maxlength: 2000 },
    notes: { type: String },
    tags: { type: [String], default: [] },
    isPrivate: { type: Boolean, default: false },
    version: { type: Number, default: 1 },
} as const

// ─── Shared base indexes helper ───────────────────────────────────────────────

export function addBaseIndexes(schema: Schema): void {
    schema.index({ codexId: 1, createdAt: -1 })
    schema.index({ accountId: 1, codexId: 1 })
    schema.index({ codexId: 1, worldId: 1 })
    schema.index({ codexId: 1, tags: 1 })
    schema.index({ name: 'text', description: 'text', notes: 'text' })
}

// ─── toClient helper ──────────────────────────────────────────────────────────

export function buildToClient(this: any): Record<string, unknown> {
    const { _id, __v, ...rest } = this.toObject()
    return { ...rest, id: _id?.toString() }
}
