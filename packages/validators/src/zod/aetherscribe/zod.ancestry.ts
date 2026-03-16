import { z } from 'zod'
import { Z_ObjectId } from '../zod.common'
import { Z_BaseDocument, Z_BaseDocumentCreate, Z_BaseDocumentUpdate } from './zod.base'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Z_AncestrySubCategory = z.enum([
    'ancestry',    // Core ancestry / main race definition
    'heritage',    // Sub-ancestry / variant (e.g. Mountain Dwarf, Hill Dwarf)
])

export const Z_AncestrySize = z.enum(['tiny', 'small', 'medium', 'large'])

// ─── Sub-documents ────────────────────────────────────────────────────────────

export const Z_AncestryTrait = z.object({
    name: z.string(),
    type: z.enum(['passive', 'active', 'feature', 'bonus']).optional(),
    description: z.string(),
    source: z.string().optional(),
})

export const Z_AbilityScoreIncrease = z.object({
    ability: z.string(),
    increase: z.number().int(),
})

// ─── Ancestry Document ────────────────────────────────────────────────────────

export const Z_Ancestry = Z_BaseDocument.extend({
    subCategory: Z_AncestrySubCategory,
    parentAncestryId: Z_ObjectId.optional(),
    size: Z_AncestrySize.optional(),
    speed: z.number().int().nonnegative().optional(),
    languages: z.array(z.string()).optional(),
    abilityScoreIncreases: z.array(Z_AbilityScoreIncrease).optional(),
    traits: z.array(Z_AncestryTrait).optional(),
    lifespan: z.string().optional(),
    adultAge: z.number().int().nonnegative().optional(),
    maxAge: z.number().int().nonnegative().optional(),
    appearance: z.string().optional(),
    culture: z.string().optional(),
    history: z.string().optional(),
    relations: z.string().optional(),
    alignment: z.string().optional(),
    homeland: z.string().optional(),
    religion: z.string().optional(),
    naming: z.object({
        conventions: z.string().optional(),
        maleNames: z.array(z.string()).optional(),
        femaleNames: z.array(z.string()).optional(),
        familyNames: z.array(z.string()).optional(),
    }).optional(),
    imageUrl: z.string().optional(),
})

// ─── Request Schemas ──────────────────────────────────────────────────────────

export const Z_CreateAncestryRequest = Z_BaseDocumentCreate.extend({
    subCategory: Z_AncestrySubCategory,
    parentAncestryId: Z_ObjectId.optional(),
    size: Z_AncestrySize.optional(),
    speed: z.number().int().nonnegative().optional(),
    languages: z.array(z.string()).optional(),
    abilityScoreIncreases: z.array(Z_AbilityScoreIncrease).optional(),
    traits: z.array(Z_AncestryTrait).optional(),
    lifespan: z.string().max(100).optional(),
    adultAge: z.number().int().nonnegative().optional(),
    maxAge: z.number().int().nonnegative().optional(),
    appearance: z.string().optional(),
    culture: z.string().optional(),
    history: z.string().optional(),
    relations: z.string().optional(),
    alignment: z.string().max(100).optional(),
    homeland: z.string().max(100).optional(),
    religion: z.string().max(100).optional(),
    naming: z.object({
        conventions: z.string().optional(),
        maleNames: z.array(z.string()).optional(),
        femaleNames: z.array(z.string()).optional(),
        familyNames: z.array(z.string()).optional(),
    }).optional(),
    imageUrl: z.string().optional(),
})

export const Z_UpdateAncestryRequest = Z_BaseDocumentUpdate.extend({
    subCategory: Z_AncestrySubCategory.optional(),
    parentAncestryId: Z_ObjectId.optional(),
    size: Z_AncestrySize.optional(),
    speed: z.number().int().nonnegative().optional(),
    languages: z.array(z.string()).optional(),
    abilityScoreIncreases: z.array(Z_AbilityScoreIncrease).optional(),
    traits: z.array(Z_AncestryTrait).optional(),
    lifespan: z.string().max(100).optional(),
    adultAge: z.number().int().nonnegative().optional(),
    maxAge: z.number().int().nonnegative().optional(),
    appearance: z.string().optional(),
    culture: z.string().optional(),
    history: z.string().optional(),
    relations: z.string().optional(),
    alignment: z.string().max(100).optional(),
    homeland: z.string().max(100).optional(),
    religion: z.string().max(100).optional(),
    naming: z.object({
        conventions: z.string().optional(),
        maleNames: z.array(z.string()).optional(),
        femaleNames: z.array(z.string()).optional(),
        familyNames: z.array(z.string()).optional(),
    }).optional(),
    imageUrl: z.string().optional(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_AncestrySubCategory = z.infer<typeof Z_AncestrySubCategory>
export type T_AncestrySize = z.infer<typeof Z_AncestrySize>
export type T_AncestryTrait = z.infer<typeof Z_AncestryTrait>
export type T_Ancestry = z.infer<typeof Z_Ancestry>
export type T_CreateAncestryRequest = z.infer<typeof Z_CreateAncestryRequest>
export type T_UpdateAncestryRequest = z.infer<typeof Z_UpdateAncestryRequest>
