import { Schema, model, Types } from 'mongoose'
import { baseDocumentFields, addBaseIndexes, buildToClient } from './_baseSchema'

export interface I_ArcanaDoc {
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
    spellLevel?: number
    spellSchool?: string
    castingTime?: string
    castingTimeCustom?: string
    range?: string
    area?: string
    duration?: string
    isConcentration?: boolean
    isRitual?: boolean
    components?: { verbal?: boolean; somatic?: boolean; material?: boolean; materialDescription?: string; materialConsumed?: boolean; focus?: string }
    savingThrow?: string
    attackRoll?: string
    damage?: string
    damageType?: string
    higherLevels?: string
    magicSource?: string
    howMagicWorks?: string
    limitations?: string
    cost?: string
    consequences?: string
    practitioners?: string
    systemRules?: { title: string; description: string; example?: string }[]
    deityName?: string
    deityTitle?: string
    deitySymbol?: string
    deityAlignment?: string
    domains?: { name: string; description?: string; spells?: string[] }[]
    holyText?: string
    clergy?: string
    worship?: string
    afterlife?: string
    tenets?: string[]
    taboos?: string[]
    ritualPurpose?: string
    participants?: string
    materials?: string
    effect?: string
    principles?: string
    history?: string
    masterPractitioners?: string[]
    subSchools?: string[]
    imageUrl?: string
    createdAt: Date
    updatedAt: Date
    toClient(): Record<string, unknown>
}

const componentsSchema = new Schema({
    verbal: Boolean,
    somatic: Boolean,
    material: Boolean,
    materialDescription: String,
    materialConsumed: Boolean,
    focus: String,
}, { _id: false })

const domainSchema = new Schema({
    name: String,
    description: String,
    spells: [String],
}, { _id: false })

const ruleSchema = new Schema({
    title: String,
    description: String,
    example: String,
}, { _id: false })

const arcanaSchema = new Schema<I_ArcanaDoc>(
    {
        ...baseDocumentFields,
        subCategory: {
            type: String,
            enum: ['spell', 'magic_system', 'belief', 'ritual', 'school'],
            required: true,
            index: true,
        },
        spellLevel: { type: Number, min: 0, max: 10, index: true },
        spellSchool: String,
        castingTime: String,
        castingTimeCustom: String,
        range: String,
        area: String,
        duration: String,
        isConcentration: Boolean,
        isRitual: Boolean,
        components: componentsSchema,
        savingThrow: String,
        attackRoll: String,
        damage: String,
        damageType: String,
        higherLevels: String,
        magicSource: String,
        howMagicWorks: String,
        limitations: String,
        cost: String,
        consequences: String,
        practitioners: String,
        systemRules: [ruleSchema],
        deityName: String,
        deityTitle: String,
        deitySymbol: String,
        deityAlignment: String,
        domains: [domainSchema],
        holyText: String,
        clergy: String,
        worship: String,
        afterlife: String,
        tenets: [String],
        taboos: [String],
        ritualPurpose: String,
        participants: String,
        materials: String,
        effect: String,
        principles: String,
        history: String,
        masterPractitioners: [String],
        subSchools: [String],
        imageUrl: String,
    },
    { timestamps: true }
)

arcanaSchema.methods.toClient = buildToClient
addBaseIndexes(arcanaSchema)
arcanaSchema.index({ codexId: 1, subCategory: 1 })
arcanaSchema.index({ codexId: 1, spellLevel: 1 })
arcanaSchema.index({ codexId: 1, spellSchool: 1 })

const Arcana = model<I_ArcanaDoc>('Arcana', arcanaSchema)
export default Arcana
