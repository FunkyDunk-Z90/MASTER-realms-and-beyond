import { Schema, model, Types } from 'mongoose'
import { baseDocumentFields, addBaseIndexes, buildToClient } from './_baseSchema'

export interface I_BestiaryDoc {
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
    challengeRating?: string
    experiencePoints?: number
    size?: string
    alignment?: string
    creatureType?: string
    speed?: Record<string, number>
    abilityScores?: Record<string, number>
    armorClass?: number
    armorType?: string
    hitPoints?: number
    hitDice?: string
    savingThrows?: Record<string, number>
    skills?: Record<string, number>
    damageImmunities?: string[]
    damageResistances?: string[]
    damageVulnerabilities?: string[]
    conditionImmunities?: string[]
    senses?: string[]
    languages?: string[]
    specialAbilities?: { name: string; description: string; recharge?: string }[]
    actions?: { name: string; actionType?: string; description: string; attackBonus?: number; damage?: string; damageType?: string; saveType?: string; saveDC?: number }[]
    lairActions?: { name: string; description: string }[]
    legendaryActions?: { name: string; description: string }[]
    habitat?: string[]
    ecology?: string
    lore?: string
    tactics?: string
    treasureType?: string
    variants?: string[]
    imageUrl?: string
    createdAt: Date
    updatedAt: Date
    toClient(): Record<string, unknown>
}

const actionSchema = new Schema({
    name: String,
    actionType: String,
    description: String,
    attackBonus: Number,
    damage: String,
    damageType: String,
    saveType: String,
    saveDC: Number,
}, { _id: false })

const bestiarySchema = new Schema<I_BestiaryDoc>(
    {
        ...baseDocumentFields,
        subCategory: {
            type: String,
            enum: [
                'beast', 'undead', 'construct', 'aberration', 'celestial',
                'fiend', 'elemental', 'humanoid', 'dragon', 'fey',
                'monstrosity', 'plant', 'ooze', 'giant', 'custom',
            ],
            required: true,
            index: true,
        },
        challengeRating: String,
        experiencePoints: Number,
        size: { type: String, enum: ['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'] },
        alignment: String,
        creatureType: String,
        speed: {
            walk: Number,
            fly: Number,
            swim: Number,
            climb: Number,
            burrow: Number,
        },
        abilityScores: {
            strength: Number,
            dexterity: Number,
            constitution: Number,
            intelligence: Number,
            wisdom: Number,
            charisma: Number,
        },
        armorClass: Number,
        armorType: String,
        hitPoints: Number,
        hitDice: String,
        savingThrows: { type: Map, of: Number },
        skills: { type: Map, of: Number },
        damageImmunities: [String],
        damageResistances: [String],
        damageVulnerabilities: [String],
        conditionImmunities: [String],
        senses: [String],
        languages: [String],
        specialAbilities: [{ name: String, description: String, recharge: String, _id: false }],
        actions: [actionSchema],
        lairActions: [actionSchema],
        legendaryActions: [actionSchema],
        habitat: [String],
        ecology: String,
        lore: String,
        tactics: String,
        treasureType: String,
        variants: [String],
        imageUrl: String,
    },
    { timestamps: true }
)

bestiarySchema.methods.toClient = buildToClient
addBaseIndexes(bestiarySchema)
bestiarySchema.index({ codexId: 1, subCategory: 1 })
bestiarySchema.index({ codexId: 1, challengeRating: 1 })

const BestiaryEntry = model<I_BestiaryDoc>('BestiaryEntry', bestiarySchema)
export default BestiaryEntry
