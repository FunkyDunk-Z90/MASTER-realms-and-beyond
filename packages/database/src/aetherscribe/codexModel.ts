import { Schema, model, Types } from 'mongoose'

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const recentEntrySchema = new Schema(
    {
        docId: { type: Schema.Types.ObjectId, required: true },
        category: { type: String, required: true },
        name: { type: String, required: true },
        updatedAt: { type: Date, required: true },
    },
    { _id: false }
)

// ─── Document Interface ───────────────────────────────────────────────────────

export interface I_RecentEntry {
    docId: Types.ObjectId
    category: string
    name: string
    updatedAt: Date
}

export interface I_CodexContent {
    worlds: Types.ObjectId[]
    campaigns: Types.ObjectId[]
    characters: Types.ObjectId[]
    npcs: Types.ObjectId[]
    bestiary: Types.ObjectId[]
    ancestries: Types.ObjectId[]
    lore: Types.ObjectId[]
    items: Types.ObjectId[]
    arcana: Types.ObjectId[]
    locations: Types.ObjectId[]
    nations: Types.ObjectId[]
    factions: Types.ObjectId[]
}

export interface I_CodexDoc {
    _id: Types.ObjectId
    accountId: Types.ObjectId
    name: string
    description?: string
    coverImageUrl?: string
    isDefault: boolean
    content: I_CodexContent
    recent: I_RecentEntry[]
    createdAt: Date
    updatedAt: Date
    toClient(): Record<string, unknown>
}

export interface I_CodexMethods {
    toClient(): Record<string, unknown>
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const contentSchema = new Schema(
    {
        worlds:     { type: [Schema.Types.ObjectId], default: [] },
        campaigns:  { type: [Schema.Types.ObjectId], default: [] },
        characters: { type: [Schema.Types.ObjectId], default: [] },
        npcs:       { type: [Schema.Types.ObjectId], default: [] },
        bestiary:   { type: [Schema.Types.ObjectId], default: [] },
        ancestries: { type: [Schema.Types.ObjectId], default: [] },
        lore:       { type: [Schema.Types.ObjectId], default: [] },
        items:      { type: [Schema.Types.ObjectId], default: [] },
        arcana:     { type: [Schema.Types.ObjectId], default: [] },
        locations:  { type: [Schema.Types.ObjectId], default: [] },
        nations:    { type: [Schema.Types.ObjectId], default: [] },
        factions:   { type: [Schema.Types.ObjectId], default: [] },
    },
    { _id: false }
)

const codexSchema = new Schema<I_CodexDoc, {}, I_CodexMethods>(
    {
        accountId: {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80,
        },
        description: { type: String, maxlength: 500 },
        coverImageUrl: { type: String },
        isDefault: { type: Boolean, default: false, index: true },
        content: { type: contentSchema, default: () => ({}) },
        recent: { type: [recentEntrySchema], default: [] },
    },
    { timestamps: true }
)

// ─── Methods ──────────────────────────────────────────────────────────────────

codexSchema.methods.toClient = function () {
    const { _id, __v, ...rest } = this.toObject()

    // Stringify all ObjectId arrays in content
    const content: Record<string, string[]> = {}
    if (rest.content) {
        for (const [key, ids] of Object.entries(rest.content as Record<string, Types.ObjectId[]>)) {
            content[key] = ids.map((id) => id.toString())
        }
    }

    // Stringify docId in each recent entry
    const recent = (rest.recent ?? []).map((r: I_RecentEntry) => ({
        ...r,
        docId: r.docId.toString(),
    }))

    return { ...rest, id: _id?.toString(), content, recent }
}

// ─── Indexes ──────────────────────────────────────────────────────────────────

codexSchema.index({ accountId: 1, createdAt: -1 })

// ─── Model ────────────────────────────────────────────────────────────────────

const Codex = model<I_CodexDoc>('Codex', codexSchema)

export default Codex
