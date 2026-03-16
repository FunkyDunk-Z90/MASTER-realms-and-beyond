import { z } from 'zod'
import { Z_ObjectId } from '../zod.common'
import { Z_BaseDocument, Z_BaseDocumentCreate, Z_BaseDocumentUpdate } from './zod.base'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Z_NationSubCategory = z.enum([
    'kingdom',               // Monarchy — ruled by a king or queen
    'empire',                // Large empire under a single ruler or council
    'republic',              // Elected or representative government
    'city_state',            // Independent city with its own governance
    'tribal_confederation',  // Loose alliance of tribes
    'theocracy',             // Ruled by religious authority
    'oligarchy',             // Ruled by a small powerful group
    'duchy',                 // Ruled by a duke/duchess, often vassal state
    'federation',            // Alliance of semi-autonomous states
    'corporate_state',       // Ruled by corporations or merchant guilds
])

// ─── Sub-documents ────────────────────────────────────────────────────────────

export const Z_NationGovernment = z.object({
    type: z.string().optional(),
    ruler: z.string().optional(),
    rulerTitle: z.string().optional(),
    succession: z.string().optional(),
    legislature: z.string().optional(),
    judiciary: z.string().optional(),
    bureaucracy: z.string().optional(),
})

export const Z_NationMilitary = z.object({
    size: z.string().optional(),
    strength: z.enum(['weak', 'modest', 'formidable', 'powerful', 'legendary']).optional(),
    commander: z.string().optional(),
    notableUnits: z.array(z.string()).optional(),
    navy: z.string().optional(),
    tactics: z.string().optional(),
})

export const Z_NationEconomy = z.object({
    currency: z.string().optional(),
    primaryIndustries: z.array(z.string()).optional(),
    tradePartners: z.array(z.string()).optional(),
    wealth: z.enum(['impoverished', 'poor', 'modest', 'prosperous', 'wealthy', 'opulent']).optional(),
    imports: z.array(z.string()).optional(),
    exports: z.array(z.string()).optional(),
})

export const Z_DiplomaticRelation = z.object({
    nationName: z.string(),
    status: z.enum(['ally', 'friendly', 'neutral', 'tense', 'hostile', 'at_war']),
    notes: z.string().optional(),
})

// ─── Nation Document ──────────────────────────────────────────────────────────

export const Z_Nation = Z_BaseDocument.extend({
    subCategory: Z_NationSubCategory,
    capitalId: Z_ObjectId.optional(),
    capitalName: z.string().optional(),
    population: z.number().int().nonnegative().optional(),
    populationDescription: z.string().optional(),
    territory: z.string().optional(),
    governmentDoc: Z_NationGovernment.optional(),
    military: Z_NationMilitary.optional(),
    economy: Z_NationEconomy.optional(),
    diplomacy: z.array(Z_DiplomaticRelation).optional(),
    primaryReligions: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    ethnicGroups: z.array(z.string()).optional(),
    culture: z.string().optional(),
    history: z.string().optional(),
    currentEvents: z.string().optional(),
    internalConflicts: z.string().optional(),
    holidays: z.array(z.object({ name: z.string(), description: z.string().optional() })).optional(),
    flagDescription: z.string().optional(),
    imageUrl: z.string().optional(),
    mapImageUrl: z.string().optional(),
})

// ─── Request Schemas ──────────────────────────────────────────────────────────

export const Z_CreateNationRequest = Z_BaseDocumentCreate.extend({
    subCategory: Z_NationSubCategory,
    capitalName: z.string().max(100).optional(),
    population: z.number().int().nonnegative().optional(),
    populationDescription: z.string().optional(),
    territory: z.string().optional(),
    governmentDoc: Z_NationGovernment.optional(),
    military: Z_NationMilitary.optional(),
    economy: Z_NationEconomy.optional(),
    diplomacy: z.array(Z_DiplomaticRelation).optional(),
    primaryReligions: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    ethnicGroups: z.array(z.string()).optional(),
    culture: z.string().optional(),
    history: z.string().optional(),
    currentEvents: z.string().optional(),
    holidays: z.array(z.object({ name: z.string(), description: z.string().optional() })).optional(),
    imageUrl: z.string().optional(),
    mapImageUrl: z.string().optional(),
})

export const Z_UpdateNationRequest = Z_BaseDocumentUpdate.extend({
    subCategory: Z_NationSubCategory.optional(),
    capitalId: Z_ObjectId.optional(),
    capitalName: z.string().max(100).optional(),
    population: z.number().int().nonnegative().optional(),
    populationDescription: z.string().optional(),
    territory: z.string().optional(),
    governmentDoc: Z_NationGovernment.optional(),
    military: Z_NationMilitary.optional(),
    economy: Z_NationEconomy.optional(),
    diplomacy: z.array(Z_DiplomaticRelation).optional(),
    primaryReligions: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    ethnicGroups: z.array(z.string()).optional(),
    culture: z.string().optional(),
    history: z.string().optional(),
    currentEvents: z.string().optional(),
    internalConflicts: z.string().optional(),
    holidays: z.array(z.object({ name: z.string(), description: z.string().optional() })).optional(),
    flagDescription: z.string().optional(),
    imageUrl: z.string().optional(),
    mapImageUrl: z.string().optional(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_NationSubCategory = z.infer<typeof Z_NationSubCategory>
export type T_NationGovernment = z.infer<typeof Z_NationGovernment>
export type T_NationMilitary = z.infer<typeof Z_NationMilitary>
export type T_NationEconomy = z.infer<typeof Z_NationEconomy>
export type T_DiplomaticRelation = z.infer<typeof Z_DiplomaticRelation>
export type T_Nation = z.infer<typeof Z_Nation>
export type T_CreateNationRequest = z.infer<typeof Z_CreateNationRequest>
export type T_UpdateNationRequest = z.infer<typeof Z_UpdateNationRequest>
