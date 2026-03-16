import { Schema, model, Types } from 'mongoose'
import { baseDocumentFields, addBaseIndexes, buildToClient } from './_baseSchema'

export interface I_FactionDoc {
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
    headquartersId?: Types.ObjectId
    headquartersName?: string
    memberCount?: string
    influence?: string
    alignment?: string
    founded?: string
    isSecret?: boolean
    goals?: string
    methods?: string
    philosophy?: string
    publicFace?: string
    trueNature?: string
    resources?: string
    rivals?: string[]
    allies?: string[]
    relations?: { factionName: string; status: string; notes?: string }[]
    leadership?: { title: string; name?: string; description?: string }[]
    ranks?: { name: string; tier: number; description?: string; requirements?: string; privileges?: string[] }[]
    symbols?: string
    motto?: string
    rituals?: string
    history?: string
    currentActivity?: string
    secrets?: string
    imageUrl?: string
    createdAt: Date
    updatedAt: Date
    toClient(): Record<string, unknown>
}

const relationSchema = new Schema({ factionName: String, status: String, notes: String }, { _id: false })
const leaderSchema = new Schema({ title: String, name: String, description: String }, { _id: false })
const rankSchema = new Schema({ name: String, tier: Number, description: String, requirements: String, privileges: [String] }, { _id: false })

const factionSchema = new Schema<I_FactionDoc>(
    {
        ...baseDocumentFields,
        subCategory: {
            type: String,
            enum: ['guild', 'secret_society', 'military_force', 'religious_order', 'criminal', 'political', 'mercantile', 'scholarly', 'tribal', 'revolutionary'],
            required: true,
            index: true,
        },
        headquartersId: Schema.Types.ObjectId,
        headquartersName: String,
        memberCount: String,
        influence: { type: String, enum: ['negligible', 'minor', 'moderate', 'significant', 'dominant'] },
        alignment: String,
        founded: String,
        isSecret: Boolean,
        goals: String,
        methods: String,
        philosophy: String,
        publicFace: String,
        trueNature: String,
        resources: String,
        rivals: [String],
        allies: [String],
        relations: [relationSchema],
        leadership: [leaderSchema],
        ranks: [rankSchema],
        symbols: String,
        motto: String,
        rituals: String,
        history: String,
        currentActivity: String,
        secrets: String,
        imageUrl: String,
    },
    { timestamps: true }
)

factionSchema.methods.toClient = buildToClient
addBaseIndexes(factionSchema)
factionSchema.index({ codexId: 1, subCategory: 1 })
factionSchema.index({ codexId: 1, influence: 1 })

const Faction = model<I_FactionDoc>('Faction', factionSchema)
export default Faction
