import { z } from 'zod'
import { Z_BaseDocument, Z_BaseDocumentCreate, Z_BaseDocumentUpdate } from './zod.base'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Z_LoreSubCategory = z.enum([
    'history',          // Historical records, timelines, past events
    'myth',             // Creation myths, origin stories
    'culture',          // Customs, traditions, arts, society
    'religion_overview',// Overview of a religion or pantheon
    'event',            // A specific notable historical event
    'prophecy',         // Foretold futures, omens, oracles
    'legend',           // Legendary tales, epics, folklore
])

// ─── Sub-documents ────────────────────────────────────────────────────────────

export const Z_TimelineEntry = z.object({
    inWorldDate: z.string(),
    title: z.string(),
    description: z.string().optional(),
    significance: z.enum(['minor', 'notable', 'major', 'world_changing']).optional(),
})

// ─── Lore Document ────────────────────────────────────────────────────────────

export const Z_Lore = Z_BaseDocument.extend({
    subCategory: Z_LoreSubCategory,
    era: z.string().optional(),
    inWorldDate: z.string().optional(),
    significance: z.enum(['minor', 'notable', 'major', 'world_changing']).optional(),
    isSecret: z.boolean().optional(),
    knownBy: z.string().optional(),
    discoveredBy: z.string().optional(),
    primarySources: z.array(z.string()).optional(),
    timeline: z.array(Z_TimelineEntry).optional(),
    consequences: z.string().optional(),
    relatedLore: z.array(z.string()).optional(),
    artUrl: z.string().optional(),
})

// ─── Request Schemas ──────────────────────────────────────────────────────────

export const Z_CreateLoreRequest = Z_BaseDocumentCreate.extend({
    subCategory: Z_LoreSubCategory,
    era: z.string().max(150).optional(),
    inWorldDate: z.string().max(150).optional(),
    significance: z.enum(['minor', 'notable', 'major', 'world_changing']).optional(),
    isSecret: z.boolean().optional(),
    knownBy: z.string().optional(),
    discoveredBy: z.string().optional(),
    primarySources: z.array(z.string()).optional(),
    timeline: z.array(Z_TimelineEntry).optional(),
    consequences: z.string().optional(),
    relatedLore: z.array(z.string()).optional(),
    artUrl: z.string().optional(),
})

export const Z_UpdateLoreRequest = Z_BaseDocumentUpdate.extend({
    subCategory: Z_LoreSubCategory.optional(),
    era: z.string().max(150).optional(),
    inWorldDate: z.string().max(150).optional(),
    significance: z.enum(['minor', 'notable', 'major', 'world_changing']).optional(),
    isSecret: z.boolean().optional(),
    knownBy: z.string().optional(),
    discoveredBy: z.string().optional(),
    primarySources: z.array(z.string()).optional(),
    timeline: z.array(Z_TimelineEntry).optional(),
    consequences: z.string().optional(),
    relatedLore: z.array(z.string()).optional(),
    artUrl: z.string().optional(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_LoreSubCategory = z.infer<typeof Z_LoreSubCategory>
export type T_TimelineEntry = z.infer<typeof Z_TimelineEntry>
export type T_Lore = z.infer<typeof Z_Lore>
export type T_CreateLoreRequest = z.infer<typeof Z_CreateLoreRequest>
export type T_UpdateLoreRequest = z.infer<typeof Z_UpdateLoreRequest>
