import { z } from 'zod'
import { Z_ObjectId } from '../zod.common'
import { Z_BaseDocument, Z_BaseDocumentCreate, Z_BaseDocumentUpdate, Z_Ruleset } from './zod.base'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Z_CharacterSubCategory = z.enum([
    'hero',       // Active player character
    'antihero',   // Morally grey protagonist
    'retired',    // Former active character
    'deceased',   // Dead character
])

export const Z_Alignment = z.enum([
    'lawful_good', 'neutral_good', 'chaotic_good',
    'lawful_neutral', 'true_neutral', 'chaotic_neutral',
    'lawful_evil', 'neutral_evil', 'chaotic_evil',
    'unaligned',
])

// ─── Sub-documents ────────────────────────────────────────────────────────────

export const Z_AbilityScores = z.object({
    strength: z.number().int().min(1).max(30).optional(),
    dexterity: z.number().int().min(1).max(30).optional(),
    constitution: z.number().int().min(1).max(30).optional(),
    intelligence: z.number().int().min(1).max(30).optional(),
    wisdom: z.number().int().min(1).max(30).optional(),
    charisma: z.number().int().min(1).max(30).optional(),
})

export const Z_CharacterAppearance = z.object({
    age: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    eyeColor: z.string().optional(),
    hairColor: z.string().optional(),
    skinColor: z.string().optional(),
    distinguishingFeatures: z.string().optional(),
    portraitUrl: z.string().optional(),
})

export const Z_CharacterVitals = z.object({
    maxHitPoints: z.number().int().nonnegative().optional(),
    currentHitPoints: z.number().int().optional(),
    temporaryHitPoints: z.number().int().nonnegative().optional(),
    armorClass: z.number().int().nonnegative().optional(),
    speed: z.number().int().nonnegative().optional(),
    initiative: z.number().int().optional(),
    proficiencyBonus: z.number().int().nonnegative().optional(),
    passivePerception: z.number().int().nonnegative().optional(),
})

// ─── PlayerCharacter Document ─────────────────────────────────────────────────

export const Z_PlayerCharacter = Z_BaseDocument.extend({
    subCategory: Z_CharacterSubCategory,
    ruleset: Z_Ruleset.optional(),
    campaignId: Z_ObjectId.optional(),
    ancestry: z.string().optional(),
    heritage: z.string().optional(),
    characterClass: z.string().optional(),
    subclass: z.string().optional(),
    level: z.number().int().min(1).max(30).optional(),
    background: z.string().optional(),
    alignment: Z_Alignment.optional(),
    experience: z.number().int().nonnegative().optional(),
    abilityScores: Z_AbilityScores.optional(),
    vitals: Z_CharacterVitals.optional(),
    skills: z.array(z.string()).optional(),
    proficiencies: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    spellcastingClass: z.string().optional(),
    spellcastingAbility: z.string().optional(),
    spellSlots: z.record(z.string(), z.number().int().nonnegative()).optional(),
    backstory: z.string().optional(),
    personalityTraits: z.string().optional(),
    ideals: z.string().optional(),
    bonds: z.string().optional(),
    flaws: z.string().optional(),
    appearance: Z_CharacterAppearance.optional(),
    equipment: z.array(z.string()).optional(),
    wealth: z.object({
        platinum: z.number().int().nonnegative().optional(),
        gold: z.number().int().nonnegative().optional(),
        silver: z.number().int().nonnegative().optional(),
        copper: z.number().int().nonnegative().optional(),
    }).optional(),
    featsList: z.array(z.string()).optional(),
    allies: z.string().optional(),
    enemies: z.string().optional(),
    organizations: z.string().optional(),
    additionalTraits: z.string().optional(),
})

// ─── Request Schemas ──────────────────────────────────────────────────────────

export const Z_CreatePlayerCharacterRequest = Z_BaseDocumentCreate.extend({
    subCategory: Z_CharacterSubCategory,
    ruleset: Z_Ruleset.optional(),
    campaignId: Z_ObjectId.optional(),
    ancestry: z.string().max(80).optional(),
    heritage: z.string().max(80).optional(),
    characterClass: z.string().max(80).optional(),
    subclass: z.string().max(80).optional(),
    level: z.number().int().min(1).max(30).optional(),
    background: z.string().max(80).optional(),
    alignment: Z_Alignment.optional(),
    abilityScores: Z_AbilityScores.optional(),
    vitals: Z_CharacterVitals.optional(),
    skills: z.array(z.string()).optional(),
    proficiencies: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    backstory: z.string().optional(),
    personalityTraits: z.string().optional(),
    ideals: z.string().optional(),
    bonds: z.string().optional(),
    flaws: z.string().optional(),
    appearance: Z_CharacterAppearance.optional(),
    equipment: z.array(z.string()).optional(),
})

export const Z_UpdatePlayerCharacterRequest = Z_BaseDocumentUpdate.extend({
    subCategory: Z_CharacterSubCategory.optional(),
    ruleset: Z_Ruleset.optional(),
    campaignId: Z_ObjectId.optional(),
    ancestry: z.string().max(80).optional(),
    heritage: z.string().max(80).optional(),
    characterClass: z.string().max(80).optional(),
    subclass: z.string().max(80).optional(),
    level: z.number().int().min(1).max(30).optional(),
    background: z.string().max(80).optional(),
    alignment: Z_Alignment.optional(),
    experience: z.number().int().nonnegative().optional(),
    abilityScores: Z_AbilityScores.optional(),
    vitals: Z_CharacterVitals.optional(),
    skills: z.array(z.string()).optional(),
    proficiencies: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    spellcastingClass: z.string().optional(),
    spellcastingAbility: z.string().optional(),
    spellSlots: z.record(z.string(), z.number().int().nonnegative()).optional(),
    backstory: z.string().optional(),
    personalityTraits: z.string().optional(),
    ideals: z.string().optional(),
    bonds: z.string().optional(),
    flaws: z.string().optional(),
    appearance: Z_CharacterAppearance.optional(),
    equipment: z.array(z.string()).optional(),
    wealth: z.object({
        platinum: z.number().int().nonnegative().optional(),
        gold: z.number().int().nonnegative().optional(),
        silver: z.number().int().nonnegative().optional(),
        copper: z.number().int().nonnegative().optional(),
    }).optional(),
    featsList: z.array(z.string()).optional(),
    allies: z.string().optional(),
    enemies: z.string().optional(),
    organizations: z.string().optional(),
    additionalTraits: z.string().optional(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_CharacterSubCategory = z.infer<typeof Z_CharacterSubCategory>
export type T_Alignment = z.infer<typeof Z_Alignment>
export type T_AbilityScores = z.infer<typeof Z_AbilityScores>
export type T_CharacterAppearance = z.infer<typeof Z_CharacterAppearance>
export type T_CharacterVitals = z.infer<typeof Z_CharacterVitals>
export type T_PlayerCharacter = z.infer<typeof Z_PlayerCharacter>
export type T_CreatePlayerCharacterRequest = z.infer<typeof Z_CreatePlayerCharacterRequest>
export type T_UpdatePlayerCharacterRequest = z.infer<typeof Z_UpdatePlayerCharacterRequest>
