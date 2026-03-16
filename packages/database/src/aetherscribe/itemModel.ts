import { Schema, model, Types } from 'mongoose'
import { baseDocumentFields, addBaseIndexes, buildToClient } from './_baseSchema'

export interface I_ItemDoc {
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
    rarity?: string
    requiresAttunement?: boolean
    attunementRequirements?: string
    weight?: number
    value?: string
    valueInGold?: number
    weaponCategory?: string
    damage?: string
    damageType?: string
    secondaryDamage?: string
    range?: string
    properties?: string[]
    armorCategory?: string
    armorClass?: number
    strengthRequirement?: number
    stealthDisadvantage?: boolean
    uses?: number
    isMagical?: boolean
    isArtifact?: boolean
    charges?: number
    maxCharges?: number
    recharge?: string
    effects?: { name: string; description: string; requiresActivation?: boolean; charges?: number; recharge?: string }[]
    creator?: string
    history?: string
    curseDescription?: string
    isCursed?: boolean
    currentOwner?: Types.ObjectId
    imageUrl?: string
    createdAt: Date
    updatedAt: Date
    toClient(): Record<string, unknown>
}

const effectSchema = new Schema({
    name: String,
    description: String,
    requiresActivation: Boolean,
    charges: Number,
    recharge: String,
}, { _id: false })

const itemSchema = new Schema<I_ItemDoc>(
    {
        ...baseDocumentFields,
        subCategory: {
            type: String,
            enum: ['weapon', 'armor', 'tool', 'consumable', 'artifact', 'currency', 'trinket', 'vehicle', 'spellbook', 'wondrous'],
            required: true,
            index: true,
        },
        rarity: {
            type: String,
            enum: ['common', 'uncommon', 'rare', 'very_rare', 'legendary', 'artifact', 'unique'],
            index: true,
        },
        requiresAttunement: Boolean,
        attunementRequirements: String,
        weight: Number,
        value: String,
        valueInGold: Number,
        weaponCategory: String,
        damage: String,
        damageType: String,
        secondaryDamage: String,
        range: String,
        properties: [String],
        armorCategory: { type: String, enum: ['light', 'medium', 'heavy', 'shield'] },
        armorClass: Number,
        strengthRequirement: Number,
        stealthDisadvantage: Boolean,
        uses: Number,
        isMagical: Boolean,
        isArtifact: Boolean,
        charges: Number,
        maxCharges: Number,
        recharge: String,
        effects: [effectSchema],
        creator: String,
        history: String,
        curseDescription: String,
        isCursed: Boolean,
        currentOwner: Schema.Types.ObjectId,
        imageUrl: String,
    },
    { timestamps: true }
)

itemSchema.methods.toClient = buildToClient
addBaseIndexes(itemSchema)
itemSchema.index({ codexId: 1, subCategory: 1 })
itemSchema.index({ codexId: 1, rarity: 1 })
itemSchema.index({ codexId: 1, isMagical: 1 })

const Item = model<I_ItemDoc>('Item', itemSchema)
export default Item
