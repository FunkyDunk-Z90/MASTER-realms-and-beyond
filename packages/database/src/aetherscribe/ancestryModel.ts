import { Schema, model, Types } from 'mongoose'
import { baseDocumentFields, addBaseIndexes, buildToClient } from './_baseSchema'

export interface I_AncestryDoc {
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
    subCategory: 'ancestry' | 'heritage'
    parentAncestryId?: Types.ObjectId
    size?: string
    speed?: number
    languages?: string[]
    abilityScoreIncreases?: { ability: string; increase: number }[]
    traits?: { name: string; type?: string; description: string; source?: string }[]
    lifespan?: string
    adultAge?: number
    maxAge?: number
    appearance?: string
    culture?: string
    history?: string
    relations?: string
    alignment?: string
    homeland?: string
    religion?: string
    naming?: {
        conventions?: string
        maleNames?: string[]
        femaleNames?: string[]
        familyNames?: string[]
    }
    imageUrl?: string
    createdAt: Date
    updatedAt: Date
    toClient(): Record<string, unknown>
}

const ancestrySchema = new Schema<I_AncestryDoc>(
    {
        ...baseDocumentFields,
        subCategory: {
            type: String,
            enum: ['ancestry', 'heritage'],
            required: true,
            index: true,
        },
        parentAncestryId: { type: Schema.Types.ObjectId, index: true },
        size: { type: String, enum: ['tiny', 'small', 'medium', 'large'] },
        speed: Number,
        languages: [String],
        abilityScoreIncreases: [{ ability: String, increase: Number, _id: false }],
        traits: [{ name: String, type: String, description: String, source: String, _id: false }],
        lifespan: String,
        adultAge: Number,
        maxAge: Number,
        appearance: String,
        culture: String,
        history: String,
        relations: String,
        alignment: String,
        homeland: String,
        religion: String,
        naming: {
            conventions: String,
            maleNames: [String],
            femaleNames: [String],
            familyNames: [String],
        },
        imageUrl: String,
    },
    { timestamps: true }
)

ancestrySchema.methods.toClient = buildToClient
addBaseIndexes(ancestrySchema)
ancestrySchema.index({ codexId: 1, subCategory: 1 })
ancestrySchema.index({ codexId: 1, parentAncestryId: 1 })

const Ancestry = model<I_AncestryDoc>('Ancestry', ancestrySchema)
export default Ancestry
