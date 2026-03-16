import { z } from 'zod'
import { Z_ObjectId } from '../zod.common'
import { Z_BaseDocument, Z_BaseDocumentCreate, Z_BaseDocumentUpdate } from './zod.base'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Z_FactionSubCategory = z.enum([
    'guild',            // Professional guild (thieves, merchants, craftsmen)
    'secret_society',   // Hidden or clandestine organisation
    'military_force',   // Army, order of knights, mercenary company
    'religious_order',  // Monastic order, inquisition, cult
    'criminal',         // Crime syndicate, gang, underground operation
    'political',        // Political party, noble house, council
    'mercantile',       // Trading company, banking house, merchant league
    'scholarly',        // Academy, arcane order, lore-keeper society
    'tribal',           // Clan, tribe, or cultural group
    'revolutionary',    // Resistance movement, underground rebellion
])

export const Z_FactionInfluence = z.enum(['negligible', 'minor', 'moderate', 'significant', 'dominant'])

// ─── Sub-documents ────────────────────────────────────────────────────────────

export const Z_FactionLeader = z.object({
    title: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
})

export const Z_FactionRank = z.object({
    name: z.string(),
    tier: z.number().int().min(1),
    description: z.string().optional(),
    requirements: z.string().optional(),
    privileges: z.array(z.string()).optional(),
})

export const Z_FactionRelation = z.object({
    factionName: z.string(),
    status: z.enum(['ally', 'friendly', 'neutral', 'rival', 'hostile', 'at_war']),
    notes: z.string().optional(),
})

// ─── Faction Document ─────────────────────────────────────────────────────────

export const Z_Faction = Z_BaseDocument.extend({
    subCategory: Z_FactionSubCategory,
    headquartersId: Z_ObjectId.optional(),
    headquartersName: z.string().optional(),
    memberCount: z.string().optional(),
    influence: Z_FactionInfluence.optional(),
    alignment: z.string().optional(),
    founded: z.string().optional(),
    isSecret: z.boolean().optional(),
    goals: z.string().optional(),
    methods: z.string().optional(),
    philosophy: z.string().optional(),
    publicFace: z.string().optional(),
    trueNature: z.string().optional(),
    resources: z.string().optional(),
    rivals: z.array(z.string()).optional(),
    allies: z.array(z.string()).optional(),
    relations: z.array(Z_FactionRelation).optional(),
    leadership: z.array(Z_FactionLeader).optional(),
    ranks: z.array(Z_FactionRank).optional(),
    symbols: z.string().optional(),
    motto: z.string().optional(),
    rituals: z.string().optional(),
    history: z.string().optional(),
    currentActivity: z.string().optional(),
    secrets: z.string().optional(),
    imageUrl: z.string().optional(),
})

// ─── Request Schemas ──────────────────────────────────────────────────────────

export const Z_CreateFactionRequest = Z_BaseDocumentCreate.extend({
    subCategory: Z_FactionSubCategory,
    headquartersName: z.string().max(150).optional(),
    memberCount: z.string().max(100).optional(),
    influence: Z_FactionInfluence.optional(),
    alignment: z.string().max(80).optional(),
    founded: z.string().max(150).optional(),
    isSecret: z.boolean().optional(),
    goals: z.string().optional(),
    methods: z.string().optional(),
    philosophy: z.string().optional(),
    publicFace: z.string().optional(),
    trueNature: z.string().optional(),
    resources: z.string().optional(),
    relations: z.array(Z_FactionRelation).optional(),
    leadership: z.array(Z_FactionLeader).optional(),
    ranks: z.array(Z_FactionRank).optional(),
    symbols: z.string().optional(),
    motto: z.string().max(200).optional(),
    rituals: z.string().optional(),
    history: z.string().optional(),
    imageUrl: z.string().optional(),
})

export const Z_UpdateFactionRequest = Z_BaseDocumentUpdate.extend({
    subCategory: Z_FactionSubCategory.optional(),
    headquartersId: Z_ObjectId.optional(),
    headquartersName: z.string().max(150).optional(),
    memberCount: z.string().max(100).optional(),
    influence: Z_FactionInfluence.optional(),
    alignment: z.string().max(80).optional(),
    founded: z.string().max(150).optional(),
    isSecret: z.boolean().optional(),
    goals: z.string().optional(),
    methods: z.string().optional(),
    philosophy: z.string().optional(),
    publicFace: z.string().optional(),
    trueNature: z.string().optional(),
    resources: z.string().optional(),
    rivals: z.array(z.string()).optional(),
    allies: z.array(z.string()).optional(),
    relations: z.array(Z_FactionRelation).optional(),
    leadership: z.array(Z_FactionLeader).optional(),
    ranks: z.array(Z_FactionRank).optional(),
    symbols: z.string().optional(),
    motto: z.string().max(200).optional(),
    rituals: z.string().optional(),
    history: z.string().optional(),
    currentActivity: z.string().optional(),
    secrets: z.string().optional(),
    imageUrl: z.string().optional(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_FactionSubCategory = z.infer<typeof Z_FactionSubCategory>
export type T_FactionInfluence = z.infer<typeof Z_FactionInfluence>
export type T_FactionLeader = z.infer<typeof Z_FactionLeader>
export type T_FactionRank = z.infer<typeof Z_FactionRank>
export type T_FactionRelation = z.infer<typeof Z_FactionRelation>
export type T_Faction = z.infer<typeof Z_Faction>
export type T_CreateFactionRequest = z.infer<typeof Z_CreateFactionRequest>
export type T_UpdateFactionRequest = z.infer<typeof Z_UpdateFactionRequest>
