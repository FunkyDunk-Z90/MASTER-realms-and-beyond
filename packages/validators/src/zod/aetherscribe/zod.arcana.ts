import { z } from 'zod'
import { Z_BaseDocument, Z_BaseDocumentCreate, Z_BaseDocumentUpdate } from './zod.base'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Z_ArcanaSubCategory = z.enum([
    'spell',         // Individual spells and cantrips
    'magic_system',  // Rules for how magic works in a world
    'belief',        // Religion, faith, deity, or spiritual doctrine
    'ritual',        // Extended magical ceremonies and rites
    'school',        // Schools or traditions of magical study
])

export const Z_SpellSchool = z.enum([
    'abjuration', 'conjuration', 'divination', 'enchantment',
    'evocation', 'illusion', 'necromancy', 'transmutation',
    'universal', 'custom',
])

export const Z_CastingTime = z.enum([
    'action', 'bonus_action', 'reaction', '1_minute', '10_minutes',
    '1_hour', '8_hours', '24_hours', 'special',
])

// ─── Sub-documents ────────────────────────────────────────────────────────────

export const Z_SpellComponents = z.object({
    verbal: z.boolean().optional(),
    somatic: z.boolean().optional(),
    material: z.boolean().optional(),
    materialDescription: z.string().optional(),
    materialConsumed: z.boolean().optional(),
    focus: z.string().optional(),
})

export const Z_DeityDomain = z.object({
    name: z.string(),
    description: z.string().optional(),
    spells: z.array(z.string()).optional(),
})

export const Z_MagicSystemRule = z.object({
    title: z.string(),
    description: z.string(),
    example: z.string().optional(),
})

// ─── Arcana Document ──────────────────────────────────────────────────────────

export const Z_Arcana = Z_BaseDocument.extend({
    subCategory: Z_ArcanaSubCategory,
    // Spell fields
    spellLevel: z.number().int().min(0).max(10).optional(),
    spellSchool: Z_SpellSchool.optional(),
    castingTime: Z_CastingTime.optional(),
    castingTimeCustom: z.string().optional(),
    range: z.string().optional(),
    area: z.string().optional(),
    duration: z.string().optional(),
    isConcentration: z.boolean().optional(),
    isRitual: z.boolean().optional(),
    components: Z_SpellComponents.optional(),
    savingThrow: z.string().optional(),
    attackRoll: z.string().optional(),
    damage: z.string().optional(),
    damageType: z.string().optional(),
    higherLevels: z.string().optional(),
    // Magic system fields
    magicSource: z.string().optional(),
    howMagicWorks: z.string().optional(),
    limitations: z.string().optional(),
    cost: z.string().optional(),
    consequences: z.string().optional(),
    practitioners: z.string().optional(),
    systemRules: z.array(Z_MagicSystemRule).optional(),
    // Belief / Religion fields
    deityName: z.string().optional(),
    deityTitle: z.string().optional(),
    deitySymbol: z.string().optional(),
    deityAlignment: z.string().optional(),
    domains: z.array(Z_DeityDomain).optional(),
    holyText: z.string().optional(),
    clergy: z.string().optional(),
    worship: z.string().optional(),
    afterlife: z.string().optional(),
    tenets: z.array(z.string()).optional(),
    taboos: z.array(z.string()).optional(),
    // Ritual fields
    ritualPurpose: z.string().optional(),
    participants: z.string().optional(),
    materials: z.string().optional(),
    duration: z.string().optional(),
    effect: z.string().optional(),
    // School fields
    principles: z.string().optional(),
    history: z.string().optional(),
    masterPractitioners: z.array(z.string()).optional(),
    subSchools: z.array(z.string()).optional(),
    imageUrl: z.string().optional(),
})

// ─── Request Schemas ──────────────────────────────────────────────────────────

export const Z_CreateArcanaRequest = Z_BaseDocumentCreate.extend({
    subCategory: Z_ArcanaSubCategory,
    spellLevel: z.number().int().min(0).max(10).optional(),
    spellSchool: Z_SpellSchool.optional(),
    castingTime: Z_CastingTime.optional(),
    castingTimeCustom: z.string().optional(),
    range: z.string().optional(),
    area: z.string().optional(),
    duration: z.string().optional(),
    isConcentration: z.boolean().optional(),
    isRitual: z.boolean().optional(),
    components: Z_SpellComponents.optional(),
    savingThrow: z.string().optional(),
    attackRoll: z.string().optional(),
    damage: z.string().optional(),
    damageType: z.string().optional(),
    higherLevels: z.string().optional(),
    magicSource: z.string().optional(),
    howMagicWorks: z.string().optional(),
    limitations: z.string().optional(),
    cost: z.string().optional(),
    consequences: z.string().optional(),
    practitioners: z.string().optional(),
    systemRules: z.array(Z_MagicSystemRule).optional(),
    deityName: z.string().optional(),
    deityTitle: z.string().optional(),
    deitySymbol: z.string().optional(),
    deityAlignment: z.string().optional(),
    domains: z.array(Z_DeityDomain).optional(),
    holyText: z.string().optional(),
    clergy: z.string().optional(),
    worship: z.string().optional(),
    afterlife: z.string().optional(),
    tenets: z.array(z.string()).optional(),
    taboos: z.array(z.string()).optional(),
    ritualPurpose: z.string().optional(),
    participants: z.string().optional(),
    materials: z.string().optional(),
    effect: z.string().optional(),
    principles: z.string().optional(),
    history: z.string().optional(),
    masterPractitioners: z.array(z.string()).optional(),
    subSchools: z.array(z.string()).optional(),
    imageUrl: z.string().optional(),
})

export const Z_UpdateArcanaRequest = Z_BaseDocumentUpdate.extend({
    subCategory: Z_ArcanaSubCategory.optional(),
    spellLevel: z.number().int().min(0).max(10).optional(),
    spellSchool: Z_SpellSchool.optional(),
    castingTime: Z_CastingTime.optional(),
    castingTimeCustom: z.string().optional(),
    range: z.string().optional(),
    area: z.string().optional(),
    duration: z.string().optional(),
    isConcentration: z.boolean().optional(),
    isRitual: z.boolean().optional(),
    components: Z_SpellComponents.optional(),
    savingThrow: z.string().optional(),
    attackRoll: z.string().optional(),
    damage: z.string().optional(),
    damageType: z.string().optional(),
    higherLevels: z.string().optional(),
    magicSource: z.string().optional(),
    howMagicWorks: z.string().optional(),
    limitations: z.string().optional(),
    cost: z.string().optional(),
    consequences: z.string().optional(),
    practitioners: z.string().optional(),
    systemRules: z.array(Z_MagicSystemRule).optional(),
    deityName: z.string().optional(),
    deityTitle: z.string().optional(),
    deitySymbol: z.string().optional(),
    deityAlignment: z.string().optional(),
    domains: z.array(Z_DeityDomain).optional(),
    holyText: z.string().optional(),
    clergy: z.string().optional(),
    worship: z.string().optional(),
    afterlife: z.string().optional(),
    tenets: z.array(z.string()).optional(),
    taboos: z.array(z.string()).optional(),
    ritualPurpose: z.string().optional(),
    participants: z.string().optional(),
    materials: z.string().optional(),
    effect: z.string().optional(),
    principles: z.string().optional(),
    history: z.string().optional(),
    masterPractitioners: z.array(z.string()).optional(),
    imageUrl: z.string().optional(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_ArcanaSubCategory = z.infer<typeof Z_ArcanaSubCategory>
export type T_SpellSchool = z.infer<typeof Z_SpellSchool>
export type T_SpellComponents = z.infer<typeof Z_SpellComponents>
export type T_Arcana = z.infer<typeof Z_Arcana>
export type T_CreateArcanaRequest = z.infer<typeof Z_CreateArcanaRequest>
export type T_UpdateArcanaRequest = z.infer<typeof Z_UpdateArcanaRequest>
