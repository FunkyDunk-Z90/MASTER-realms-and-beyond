import { Schema, model, Types } from 'mongoose'
import { baseDocumentFields, addBaseIndexes, buildToClient } from './_baseSchema'

export interface I_LocationDoc {
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
    parentLocationId?: Types.ObjectId
    nationId?: Types.ObjectId
    population?: number
    populationDescription?: string
    climate?: string
    terrain?: string
    biome?: string
    government?: string
    ruler?: string
    economy?: string
    religions?: string[]
    languages?: string[]
    factions?: string[]
    notableFeatures?: string[]
    pointsOfInterest?: { name: string; type?: string; description?: string; isSecret?: boolean }[]
    floors?: { level: number; name?: string; description?: string; rooms?: { name: string; description?: string; encounters?: string[]; loot?: string[]; traps?: string[] }[] }[]
    history?: string
    atmosphere?: string
    sights?: string
    sounds?: string
    smells?: string
    dangers?: string
    secrets?: string
    mapImageUrl?: string
    imageUrl?: string
    coordinates?: { x?: number; y?: number; system?: string }
    createdAt: Date
    updatedAt: Date
    toClient(): Record<string, unknown>
}

const roomSchema = new Schema({
    name: String,
    description: String,
    encounters: [String],
    loot: [String],
    traps: [String],
}, { _id: false })

const floorSchema = new Schema({
    level: Number,
    name: String,
    description: String,
    rooms: [roomSchema],
}, { _id: false })

const poiSchema = new Schema({
    name: String,
    type: String,
    description: String,
    isSecret: Boolean,
}, { _id: false })

const locationSchema = new Schema<I_LocationDoc>(
    {
        ...baseDocumentFields,
        subCategory: {
            type: String,
            enum: ['city', 'town', 'village', 'dungeon', 'ruin', 'wilderness', 'building', 'landmark', 'plane', 'region', 'underwater', 'sky'],
            required: true,
            index: true,
        },
        parentLocationId: { type: Schema.Types.ObjectId, index: true },
        nationId: { type: Schema.Types.ObjectId, index: true },
        population: Number,
        populationDescription: String,
        climate: String,
        terrain: String,
        biome: String,
        government: String,
        ruler: String,
        economy: String,
        religions: [String],
        languages: [String],
        factions: [String],
        notableFeatures: [String],
        pointsOfInterest: [poiSchema],
        floors: [floorSchema],
        history: String,
        atmosphere: String,
        sights: String,
        sounds: String,
        smells: String,
        dangers: String,
        secrets: String,
        mapImageUrl: String,
        imageUrl: String,
        coordinates: {
            x: Number,
            y: Number,
            system: String,
        },
    },
    { timestamps: true }
)

locationSchema.methods.toClient = buildToClient
addBaseIndexes(locationSchema)
locationSchema.index({ codexId: 1, subCategory: 1 })
locationSchema.index({ codexId: 1, nationId: 1 })
locationSchema.index({ codexId: 1, parentLocationId: 1 })

const Location = model<I_LocationDoc>('Location', locationSchema)
export default Location
