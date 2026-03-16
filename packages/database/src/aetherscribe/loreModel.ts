import { Schema, model, Types } from 'mongoose'
import { baseDocumentFields, addBaseIndexes, buildToClient } from './_baseSchema'

export interface I_LoreDoc {
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
    era?: string
    inWorldDate?: string
    significance?: string
    isSecret?: boolean
    knownBy?: string
    discoveredBy?: string
    primarySources?: string[]
    timeline?: { inWorldDate: string; title: string; description?: string; significance?: string }[]
    consequences?: string
    relatedLore?: string[]
    artUrl?: string
    createdAt: Date
    updatedAt: Date
    toClient(): Record<string, unknown>
}

const loreSchema = new Schema<I_LoreDoc>(
    {
        ...baseDocumentFields,
        subCategory: {
            type: String,
            enum: ['history', 'myth', 'culture', 'religion_overview', 'event', 'prophecy', 'legend'],
            required: true,
            index: true,
        },
        era: String,
        inWorldDate: String,
        significance: {
            type: String,
            enum: ['minor', 'notable', 'major', 'world_changing'],
        },
        isSecret: Boolean,
        knownBy: String,
        discoveredBy: String,
        primarySources: [String],
        timeline: [{
            inWorldDate: String,
            title: String,
            description: String,
            significance: String,
            _id: false,
        }],
        consequences: String,
        relatedLore: [String],
        artUrl: String,
    },
    { timestamps: true }
)

loreSchema.methods.toClient = buildToClient
addBaseIndexes(loreSchema)
loreSchema.index({ codexId: 1, subCategory: 1 })
loreSchema.index({ codexId: 1, significance: 1 })

const Lore = model<I_LoreDoc>('Lore', loreSchema)
export default Lore
