import { z } from 'zod'
import { Z_BaseDocument, Z_BaseDocumentCreate, Z_BaseDocumentUpdate } from './zod.base'
import { Z_Alignment, Z_AbilityScores } from './zod.character'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Z_BestiarySubCategory = z.enum([
    'beast',        // Natural animals and mundane monsters
    'undead',       // Animated dead (zombies, vampires, liches)
    'construct',    // Artificial beings (golems, automatons)
    'aberration',   // Alien/otherworldly creatures (mind flayers, beholders)
    'celestial',    // Divine or heavenly beings (angels, archons)
    'fiend',        // Demonic or infernal beings (demons, devils)
    'elemental',    // Elemental plane beings (fire elementals, water spirits)
    'humanoid',     // Intelligent bipedal creatures (kobolds, goblins)
    'dragon',       // True dragons and dragon-kin
    'fey',          // Faerie and magical creatures (pixies, hags)
    'monstrosity',  // Magical beasts and unnatural creatures
    'plant',        // Sentient or dangerous plant life
    'ooze',         // Amorphous creatures (slimes, jellies)
    'giant',        // Giants and giant-kin
    'custom',       // User-defined creature type
])

export const Z_CreatureSize = z.enum([
    'tiny', 'small', 'medium', 'large', 'huge', 'gargantuan',
])

// ─── Sub-documents ────────────────────────────────────────────────────────────

export const Z_CreatureAction = z.object({
    name: z.string(),
    actionType: z.enum(['action', 'bonus_action', 'reaction', 'legendary', 'lair']).optional(),
    description: z.string(),
    attackBonus: z.number().int().optional(),
    damage: z.string().optional(),
    damageType: z.string().optional(),
    saveType: z.string().optional(),
    saveDC: z.number().int().nonnegative().optional(),
})

export const Z_SpecialAbility = z.object({
    name: z.string(),
    description: z.string(),
    recharge: z.string().optional(),
})

// ─── Bestiary Document ────────────────────────────────────────────────────────

export const Z_BestiaryEntry = Z_BaseDocument.extend({
    subCategory: Z_BestiarySubCategory,
    challengeRating: z.string().optional(),
    experiencePoints: z.number().int().nonnegative().optional(),
    size: Z_CreatureSize.optional(),
    alignment: Z_Alignment.optional(),
    creatureType: z.string().optional(),
    speed: z.object({
        walk: z.number().int().nonnegative().optional(),
        fly: z.number().int().nonnegative().optional(),
        swim: z.number().int().nonnegative().optional(),
        climb: z.number().int().nonnegative().optional(),
        burrow: z.number().int().nonnegative().optional(),
    }).optional(),
    abilityScores: Z_AbilityScores.optional(),
    armorClass: z.number().int().nonnegative().optional(),
    armorType: z.string().optional(),
    hitPoints: z.number().int().nonnegative().optional(),
    hitDice: z.string().optional(),
    savingThrows: z.record(z.string(), z.number().int()).optional(),
    skills: z.record(z.string(), z.number().int()).optional(),
    damageImmunities: z.array(z.string()).optional(),
    damageResistances: z.array(z.string()).optional(),
    damageVulnerabilities: z.array(z.string()).optional(),
    conditionImmunities: z.array(z.string()).optional(),
    senses: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    specialAbilities: z.array(Z_SpecialAbility).optional(),
    actions: z.array(Z_CreatureAction).optional(),
    lairActions: z.array(Z_CreatureAction).optional(),
    legendaryActions: z.array(Z_CreatureAction).optional(),
    habitat: z.array(z.string()).optional(),
    ecology: z.string().optional(),
    lore: z.string().optional(),
    tactics: z.string().optional(),
    treasureType: z.string().optional(),
    variants: z.array(z.string()).optional(),
    imageUrl: z.string().optional(),
})

// ─── Request Schemas ──────────────────────────────────────────────────────────

export const Z_CreateBestiaryEntryRequest = Z_BaseDocumentCreate.extend({
    subCategory: Z_BestiarySubCategory,
    challengeRating: z.string().optional(),
    experiencePoints: z.number().int().nonnegative().optional(),
    size: Z_CreatureSize.optional(),
    alignment: Z_Alignment.optional(),
    creatureType: z.string().max(80).optional(),
    speed: z.object({
        walk: z.number().int().nonnegative().optional(),
        fly: z.number().int().nonnegative().optional(),
        swim: z.number().int().nonnegative().optional(),
        climb: z.number().int().nonnegative().optional(),
        burrow: z.number().int().nonnegative().optional(),
    }).optional(),
    abilityScores: Z_AbilityScores.optional(),
    armorClass: z.number().int().nonnegative().optional(),
    armorType: z.string().optional(),
    hitPoints: z.number().int().nonnegative().optional(),
    hitDice: z.string().optional(),
    savingThrows: z.record(z.string(), z.number().int()).optional(),
    skills: z.record(z.string(), z.number().int()).optional(),
    damageImmunities: z.array(z.string()).optional(),
    damageResistances: z.array(z.string()).optional(),
    conditionImmunities: z.array(z.string()).optional(),
    senses: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    specialAbilities: z.array(Z_SpecialAbility).optional(),
    actions: z.array(Z_CreatureAction).optional(),
    legendaryActions: z.array(Z_CreatureAction).optional(),
    habitat: z.array(z.string()).optional(),
    ecology: z.string().optional(),
    lore: z.string().optional(),
    tactics: z.string().optional(),
    imageUrl: z.string().optional(),
})

export const Z_UpdateBestiaryEntryRequest = Z_BaseDocumentUpdate.extend({
    subCategory: Z_BestiarySubCategory.optional(),
    challengeRating: z.string().optional(),
    experiencePoints: z.number().int().nonnegative().optional(),
    size: Z_CreatureSize.optional(),
    alignment: Z_Alignment.optional(),
    creatureType: z.string().max(80).optional(),
    speed: z.object({
        walk: z.number().int().nonnegative().optional(),
        fly: z.number().int().nonnegative().optional(),
        swim: z.number().int().nonnegative().optional(),
        climb: z.number().int().nonnegative().optional(),
        burrow: z.number().int().nonnegative().optional(),
    }).optional(),
    abilityScores: Z_AbilityScores.optional(),
    armorClass: z.number().int().nonnegative().optional(),
    armorType: z.string().optional(),
    hitPoints: z.number().int().nonnegative().optional(),
    hitDice: z.string().optional(),
    savingThrows: z.record(z.string(), z.number().int()).optional(),
    skills: z.record(z.string(), z.number().int()).optional(),
    damageImmunities: z.array(z.string()).optional(),
    damageResistances: z.array(z.string()).optional(),
    conditionImmunities: z.array(z.string()).optional(),
    senses: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    specialAbilities: z.array(Z_SpecialAbility).optional(),
    actions: z.array(Z_CreatureAction).optional(),
    legendaryActions: z.array(Z_CreatureAction).optional(),
    habitat: z.array(z.string()).optional(),
    ecology: z.string().optional(),
    lore: z.string().optional(),
    tactics: z.string().optional(),
    imageUrl: z.string().optional(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_BestiarySubCategory = z.infer<typeof Z_BestiarySubCategory>
export type T_CreatureSize = z.infer<typeof Z_CreatureSize>
export type T_CreatureAction = z.infer<typeof Z_CreatureAction>
export type T_SpecialAbility = z.infer<typeof Z_SpecialAbility>
export type T_BestiaryEntry = z.infer<typeof Z_BestiaryEntry>
export type T_CreateBestiaryEntryRequest = z.infer<typeof Z_CreateBestiaryEntryRequest>
export type T_UpdateBestiaryEntryRequest = z.infer<typeof Z_UpdateBestiaryEntryRequest>
