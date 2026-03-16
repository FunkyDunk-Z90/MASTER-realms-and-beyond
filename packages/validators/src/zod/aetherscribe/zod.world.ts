import { z } from 'zod'
import { Z_ObjectId } from '../zod.common'
import {
    Z_BaseDocument,
    Z_BaseDocumentCreate,
    Z_BaseDocumentUpdate,
    Z_Ruleset,
    Z_WorldVisibility,
    Z_CollaboratorRole,
} from './zod.base'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Z_MagicLevel = z.enum(['none', 'low', 'medium', 'high', 'wild'])
export const Z_ToneDifficulty = z.enum(['light', 'balanced', 'dark', 'grimdark'])
export const Z_TechLevel = z.enum([
    'stone_age',
    'bronze_age',
    'medieval',
    'renaissance',
    'early_industrial',
    'industrial',
    'modern',
    'futuristic',
    'post_apocalyptic',
])

// ─── Sub-documents ────────────────────────────────────────────────────────────

export const Z_WorldPlane = z.object({
    name: z.string(),
    description: z.string().optional(),
    access: z.string().optional(),
})

export const Z_WorldMonth = z.object({
    name: z.string(),
    days: z.number().int().positive(),
    season: z.string().optional(),
})

export const Z_WorldContinent = z.object({
    name: z.string(),
    description: z.string().optional(),
    climate: z.string().optional(),
})

export const Z_WorldLanguage = z.object({
    name: z.string(),
    script: z.string().optional(),
    speakers: z.string().optional(),
    notes: z.string().optional(),
})

export const Z_WorldCollaborator = z.object({
    accountId: Z_ObjectId,
    role: Z_CollaboratorRole,
    addedAt: z.string(),
})

// ─── World Document ───────────────────────────────────────────────────────────

export const Z_World = Z_BaseDocument.extend({
    primaryRuleset: Z_Ruleset,
    supportedRulesets: z.array(Z_Ruleset),
    visibility: Z_WorldVisibility,
    coverImageUrl: z.string().optional(),
    bannerImageUrl: z.string().optional(),
    toneDifficulty: Z_ToneDifficulty.optional(),
    era: z.string().optional(),
    magicLevel: Z_MagicLevel.optional(),
    techLevel: Z_TechLevel.optional(),
    // Cosmology
    cosmologyNotes: z.string().optional(),
    planes: z.array(Z_WorldPlane).optional(),
    creationMyth: z.string().optional(),
    // Calendar
    calendarNotes: z.string().optional(),
    months: z.array(Z_WorldMonth).optional(),
    daysPerWeek: z.number().int().positive().optional(),
    specialDays: z.array(z.object({ name: z.string(), description: z.string().optional() })).optional(),
    // Geography
    geographyNotes: z.string().optional(),
    continents: z.array(Z_WorldContinent).optional(),
    climates: z.array(z.string()).optional(),
    // Languages
    languages: z.array(Z_WorldLanguage).optional(),
    // Collaborators
    collaborators: z.array(Z_WorldCollaborator).optional(),
})

// ─── Request Schemas ──────────────────────────────────────────────────────────

export const Z_CreateWorldRequest = Z_BaseDocumentCreate.omit({ worldId: true }).extend({
    primaryRuleset: Z_Ruleset.optional(),
    supportedRulesets: z.array(Z_Ruleset).optional(),
    visibility: Z_WorldVisibility.optional(),
    coverImageUrl: z.string().optional(),
    bannerImageUrl: z.string().optional(),
    toneDifficulty: Z_ToneDifficulty.optional(),
    era: z.string().max(150).optional(),
    magicLevel: Z_MagicLevel.optional(),
    techLevel: Z_TechLevel.optional(),
    cosmologyNotes: z.string().optional(),
    planes: z.array(Z_WorldPlane).optional(),
    creationMyth: z.string().optional(),
    calendarNotes: z.string().optional(),
    months: z.array(Z_WorldMonth).optional(),
    daysPerWeek: z.number().int().positive().optional(),
    specialDays: z.array(z.object({ name: z.string(), description: z.string().optional() })).optional(),
    geographyNotes: z.string().optional(),
    continents: z.array(Z_WorldContinent).optional(),
    climates: z.array(z.string()).optional(),
    languages: z.array(Z_WorldLanguage).optional(),
})

export const Z_UpdateWorldRequest = Z_BaseDocumentUpdate.extend({
    primaryRuleset: Z_Ruleset.optional(),
    supportedRulesets: z.array(Z_Ruleset).optional(),
    visibility: Z_WorldVisibility.optional(),
    coverImageUrl: z.string().optional(),
    bannerImageUrl: z.string().optional(),
    toneDifficulty: Z_ToneDifficulty.optional(),
    era: z.string().max(150).optional(),
    magicLevel: Z_MagicLevel.optional(),
    techLevel: Z_TechLevel.optional(),
    cosmologyNotes: z.string().optional(),
    planes: z.array(Z_WorldPlane).optional(),
    creationMyth: z.string().optional(),
    calendarNotes: z.string().optional(),
    months: z.array(Z_WorldMonth).optional(),
    daysPerWeek: z.number().int().positive().optional(),
    specialDays: z.array(z.object({ name: z.string(), description: z.string().optional() })).optional(),
    geographyNotes: z.string().optional(),
    continents: z.array(Z_WorldContinent).optional(),
    climates: z.array(z.string()).optional(),
    languages: z.array(Z_WorldLanguage).optional(),
})

export const Z_AddWorldCollaboratorRequest = z.object({
    worldId: Z_ObjectId,
    accountId: Z_ObjectId,
    role: Z_CollaboratorRole,
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_MagicLevel = z.infer<typeof Z_MagicLevel>
export type T_ToneDifficulty = z.infer<typeof Z_ToneDifficulty>
export type T_TechLevel = z.infer<typeof Z_TechLevel>
export type T_WorldPlane = z.infer<typeof Z_WorldPlane>
export type T_WorldMonth = z.infer<typeof Z_WorldMonth>
export type T_WorldLanguage = z.infer<typeof Z_WorldLanguage>
export type T_World = z.infer<typeof Z_World>
export type T_CreateWorldRequest = z.infer<typeof Z_CreateWorldRequest>
export type T_UpdateWorldRequest = z.infer<typeof Z_UpdateWorldRequest>
export type T_AddWorldCollaboratorRequest = z.infer<typeof Z_AddWorldCollaboratorRequest>
