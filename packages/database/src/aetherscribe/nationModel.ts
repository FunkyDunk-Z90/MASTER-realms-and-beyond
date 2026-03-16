import { Schema, model, Types } from 'mongoose'
import { baseDocumentFields, addBaseIndexes, buildToClient } from './_baseSchema'

export interface I_NationDoc {
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
    capitalId?: Types.ObjectId
    capitalName?: string
    population?: number
    populationDescription?: string
    territory?: string
    governmentDoc?: { type?: string; ruler?: string; rulerTitle?: string; succession?: string; legislature?: string; judiciary?: string; bureaucracy?: string }
    military?: { size?: string; strength?: string; commander?: string; notableUnits?: string[]; navy?: string; tactics?: string }
    economy?: { currency?: string; primaryIndustries?: string[]; tradePartners?: string[]; wealth?: string; imports?: string[]; exports?: string[] }
    diplomacy?: { nationName: string; status: string; notes?: string }[]
    primaryReligions?: string[]
    languages?: string[]
    ethnicGroups?: string[]
    culture?: string
    history?: string
    currentEvents?: string
    internalConflicts?: string
    holidays?: { name: string; description?: string }[]
    flagDescription?: string
    imageUrl?: string
    mapImageUrl?: string
    createdAt: Date
    updatedAt: Date
    toClient(): Record<string, unknown>
}

const governmentSchema = new Schema({ type: String, ruler: String, rulerTitle: String, succession: String, legislature: String, judiciary: String, bureaucracy: String }, { _id: false })
const militarySchema = new Schema({ size: String, strength: String, commander: String, notableUnits: [String], navy: String, tactics: String }, { _id: false })
const economySchema = new Schema({ currency: String, primaryIndustries: [String], tradePartners: [String], wealth: String, imports: [String], exports: [String] }, { _id: false })
const diplomacySchema = new Schema({ nationName: String, status: String, notes: String }, { _id: false })

const nationSchema = new Schema<I_NationDoc>(
    {
        ...baseDocumentFields,
        subCategory: {
            type: String,
            enum: ['kingdom', 'empire', 'republic', 'city_state', 'tribal_confederation', 'theocracy', 'oligarchy', 'duchy', 'federation', 'corporate_state'],
            required: true,
            index: true,
        },
        capitalId: Schema.Types.ObjectId,
        capitalName: String,
        population: Number,
        populationDescription: String,
        territory: String,
        governmentDoc: governmentSchema,
        military: militarySchema,
        economy: economySchema,
        diplomacy: [diplomacySchema],
        primaryReligions: [String],
        languages: [String],
        ethnicGroups: [String],
        culture: String,
        history: String,
        currentEvents: String,
        internalConflicts: String,
        holidays: [{ name: String, description: String, _id: false }],
        flagDescription: String,
        imageUrl: String,
        mapImageUrl: String,
    },
    { timestamps: true }
)

nationSchema.methods.toClient = buildToClient
addBaseIndexes(nationSchema)
nationSchema.index({ codexId: 1, subCategory: 1 })

const Nation = model<I_NationDoc>('Nation', nationSchema)
export default Nation
