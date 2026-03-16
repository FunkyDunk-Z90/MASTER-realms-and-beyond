import { Schema, model, Types } from 'mongoose'
import { baseDocumentFields, addBaseIndexes, buildToClient } from './_baseSchema'

// ─── Document Interface ───────────────────────────────────────────────────────

export interface I_CharacterDoc {
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
    ruleset?: string
    campaignId?: Types.ObjectId
    ancestry?: string
    heritage?: string
    characterClass?: string
    subclass?: string
    level?: number
    background?: string
    alignment?: string
    experience?: number
    abilityScores?: Record<string, number>
    vitals?: Record<string, number>
    skills?: string[]
    proficiencies?: string[]
    languages?: string[]
    spellcastingClass?: string
    spellcastingAbility?: string
    spellSlots?: Record<string, number>
    backstory?: string
    personalityTraits?: string
    ideals?: string
    bonds?: string
    flaws?: string
    appearance?: Record<string, string>
    equipment?: string[]
    wealth?: Record<string, number>
    featsList?: string[]
    allies?: string
    enemies?: string
    organizations?: string
    additionalTraits?: string
    createdAt: Date
    updatedAt: Date
    toClient(): Record<string, unknown>
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const abilityScoresSchema = new Schema({
    strength: Number,
    dexterity: Number,
    constitution: Number,
    intelligence: Number,
    wisdom: Number,
    charisma: Number,
}, { _id: false })

const vitalsSchema = new Schema({
    maxHitPoints: Number,
    currentHitPoints: Number,
    temporaryHitPoints: Number,
    armorClass: Number,
    speed: Number,
    initiative: Number,
    proficiencyBonus: Number,
    passivePerception: Number,
}, { _id: false })

const appearanceSchema = new Schema({
    age: String,
    height: String,
    weight: String,
    eyeColor: String,
    hairColor: String,
    skinColor: String,
    distinguishingFeatures: String,
    portraitUrl: String,
}, { _id: false })

const wealthSchema = new Schema({
    platinum: Number,
    gold: Number,
    silver: Number,
    copper: Number,
}, { _id: false })

const characterSchema = new Schema<I_CharacterDoc>(
    {
        ...baseDocumentFields,
        subCategory: {
            type: String,
            enum: ['hero', 'antihero', 'retired', 'deceased'],
            required: true,
            index: true,
        },
        ruleset: String,
        campaignId: { type: Schema.Types.ObjectId, index: true },
        ancestry: String,
        heritage: String,
        characterClass: String,
        subclass: String,
        level: { type: Number, min: 1, max: 30 },
        background: String,
        alignment: String,
        experience: { type: Number, min: 0 },
        abilityScores: abilityScoresSchema,
        vitals: vitalsSchema,
        skills: [String],
        proficiencies: [String],
        languages: [String],
        spellcastingClass: String,
        spellcastingAbility: String,
        spellSlots: { type: Map, of: Number },
        backstory: String,
        personalityTraits: String,
        ideals: String,
        bonds: String,
        flaws: String,
        appearance: appearanceSchema,
        equipment: [String],
        wealth: wealthSchema,
        featsList: [String],
        allies: String,
        enemies: String,
        organizations: String,
        additionalTraits: String,
    },
    { timestamps: true }
)

characterSchema.methods.toClient = buildToClient
addBaseIndexes(characterSchema)
characterSchema.index({ codexId: 1, subCategory: 1 })
characterSchema.index({ codexId: 1, campaignId: 1 })

const PlayerCharacter = model<I_CharacterDoc>('PlayerCharacter', characterSchema)
export default PlayerCharacter
