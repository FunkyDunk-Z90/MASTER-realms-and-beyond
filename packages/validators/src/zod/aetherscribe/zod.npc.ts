import { z } from 'zod'
import { Z_ObjectId } from '../zod.common'
import { Z_BaseDocument, Z_BaseDocumentCreate, Z_BaseDocumentUpdate, Z_Ruleset } from './zod.base'
import { Z_Alignment, Z_AbilityScores, Z_CharacterAppearance, Z_CharacterVitals } from './zod.character'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Z_NpcSubCategory = z.enum([
    'general',       // Generic NPC
    'villain',       // Primary or secondary antagonist
    'ally',          // Friendly NPC, companion, or mentor
    'merchant',      // Vendor, trader, or service provider
    'quest_giver',   // NPC who provides missions/quests
    'neutral',       // Bystander or neutral party
])

export const Z_NpcDisposition = z.enum(['friendly', 'neutral', 'hostile', 'unknown', 'varies'])

// ─── NPC Document ─────────────────────────────────────────────────────────────

export const Z_Npc = Z_BaseDocument.extend({
    subCategory: Z_NpcSubCategory,
    ruleset: Z_Ruleset.optional(),
    campaignId: Z_ObjectId.optional(),
    ancestry: z.string().optional(),
    characterClass: z.string().optional(),
    level: z.number().int().min(1).max(30).optional(),
    occupation: z.string().optional(),
    affiliation: z.string().optional(),
    alignment: Z_Alignment.optional(),
    disposition: Z_NpcDisposition.optional(),
    isAlive: z.boolean().optional(),
    personality: z.string().optional(),
    goals: z.string().optional(),
    secrets: z.string().optional(),
    motivations: z.string().optional(),
    fears: z.string().optional(),
    backstory: z.string().optional(),
    roleplaying: z.string().optional(),
    voice: z.string().optional(),
    mannerisms: z.string().optional(),
    appearance: Z_CharacterAppearance.optional(),
    abilityScores: Z_AbilityScores.optional(),
    vitals: Z_CharacterVitals.optional(),
    abilities: z.array(z.object({ name: z.string(), description: z.string().optional() })).optional(),
    equipment: z.array(z.string()).optional(),
    questsGiven: z.array(z.string()).optional(),
    merchandise: z.array(z.string()).optional(),
    rewardOffered: z.string().optional(),
})

// ─── Request Schemas ──────────────────────────────────────────────────────────

export const Z_CreateNpcRequest = Z_BaseDocumentCreate.extend({
    subCategory: Z_NpcSubCategory,
    ruleset: Z_Ruleset.optional(),
    campaignId: Z_ObjectId.optional(),
    ancestry: z.string().max(80).optional(),
    characterClass: z.string().max(80).optional(),
    level: z.number().int().min(1).max(30).optional(),
    occupation: z.string().max(100).optional(),
    affiliation: z.string().max(200).optional(),
    alignment: Z_Alignment.optional(),
    disposition: Z_NpcDisposition.optional(),
    isAlive: z.boolean().optional(),
    personality: z.string().optional(),
    goals: z.string().optional(),
    secrets: z.string().optional(),
    motivations: z.string().optional(),
    fears: z.string().optional(),
    backstory: z.string().optional(),
    roleplaying: z.string().optional(),
    appearance: Z_CharacterAppearance.optional(),
    abilityScores: Z_AbilityScores.optional(),
    vitals: Z_CharacterVitals.optional(),
    abilities: z.array(z.object({ name: z.string(), description: z.string().optional() })).optional(),
    equipment: z.array(z.string()).optional(),
    questsGiven: z.array(z.string()).optional(),
    merchandise: z.array(z.string()).optional(),
    rewardOffered: z.string().optional(),
})

export const Z_UpdateNpcRequest = Z_BaseDocumentUpdate.extend({
    subCategory: Z_NpcSubCategory.optional(),
    ruleset: Z_Ruleset.optional(),
    campaignId: Z_ObjectId.optional(),
    ancestry: z.string().max(80).optional(),
    characterClass: z.string().max(80).optional(),
    level: z.number().int().min(1).max(30).optional(),
    occupation: z.string().max(100).optional(),
    affiliation: z.string().max(200).optional(),
    alignment: Z_Alignment.optional(),
    disposition: Z_NpcDisposition.optional(),
    isAlive: z.boolean().optional(),
    personality: z.string().optional(),
    goals: z.string().optional(),
    secrets: z.string().optional(),
    motivations: z.string().optional(),
    fears: z.string().optional(),
    backstory: z.string().optional(),
    roleplaying: z.string().optional(),
    voice: z.string().optional(),
    mannerisms: z.string().optional(),
    appearance: Z_CharacterAppearance.optional(),
    abilityScores: Z_AbilityScores.optional(),
    vitals: Z_CharacterVitals.optional(),
    abilities: z.array(z.object({ name: z.string(), description: z.string().optional() })).optional(),
    equipment: z.array(z.string()).optional(),
    questsGiven: z.array(z.string()).optional(),
    merchandise: z.array(z.string()).optional(),
    rewardOffered: z.string().optional(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_NpcSubCategory = z.infer<typeof Z_NpcSubCategory>
export type T_NpcDisposition = z.infer<typeof Z_NpcDisposition>
export type T_Npc = z.infer<typeof Z_Npc>
export type T_CreateNpcRequest = z.infer<typeof Z_CreateNpcRequest>
export type T_UpdateNpcRequest = z.infer<typeof Z_UpdateNpcRequest>
