import { Schema, model, Types } from 'mongoose'
import { baseDocumentFields, addBaseIndexes, buildToClient } from './_baseSchema'

export interface I_NpcDoc {
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
    characterClass?: string
    level?: number
    occupation?: string
    affiliation?: string
    alignment?: string
    disposition?: string
    isAlive?: boolean
    personality?: string
    goals?: string
    secrets?: string
    motivations?: string
    fears?: string
    backstory?: string
    roleplaying?: string
    voice?: string
    mannerisms?: string
    appearance?: Record<string, string>
    abilityScores?: Record<string, number>
    vitals?: Record<string, number>
    abilities?: { name: string; description?: string }[]
    equipment?: string[]
    questsGiven?: string[]
    merchandise?: string[]
    rewardOffered?: string
    createdAt: Date
    updatedAt: Date
    toClient(): Record<string, unknown>
}

const npcSchema = new Schema<I_NpcDoc>(
    {
        ...baseDocumentFields,
        subCategory: {
            type: String,
            enum: ['general', 'villain', 'ally', 'merchant', 'quest_giver', 'neutral'],
            required: true,
            index: true,
        },
        ruleset: String,
        campaignId: { type: Schema.Types.ObjectId, index: true },
        ancestry: String,
        characterClass: String,
        level: { type: Number, min: 1, max: 30 },
        occupation: String,
        affiliation: String,
        alignment: String,
        disposition: {
            type: String,
            enum: ['friendly', 'neutral', 'hostile', 'unknown', 'varies'],
        },
        isAlive: { type: Boolean, default: true },
        personality: String,
        goals: String,
        secrets: String,
        motivations: String,
        fears: String,
        backstory: String,
        roleplaying: String,
        voice: String,
        mannerisms: String,
        appearance: {
            age: String,
            height: String,
            weight: String,
            eyeColor: String,
            hairColor: String,
            skinColor: String,
            distinguishingFeatures: String,
            portraitUrl: String,
        },
        abilityScores: {
            strength: Number,
            dexterity: Number,
            constitution: Number,
            intelligence: Number,
            wisdom: Number,
            charisma: Number,
        },
        vitals: {
            maxHitPoints: Number,
            currentHitPoints: Number,
            armorClass: Number,
            speed: Number,
        },
        abilities: [{ name: String, description: String, _id: false }],
        equipment: [String],
        questsGiven: [String],
        merchandise: [String],
        rewardOffered: String,
    },
    { timestamps: true }
)

npcSchema.methods.toClient = buildToClient
addBaseIndexes(npcSchema)
npcSchema.index({ codexId: 1, subCategory: 1 })
npcSchema.index({ codexId: 1, isAlive: 1 })

const Npc = model<I_NpcDoc>('Npc', npcSchema)
export default Npc
