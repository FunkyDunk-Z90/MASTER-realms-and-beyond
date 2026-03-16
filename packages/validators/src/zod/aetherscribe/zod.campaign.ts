import { z } from 'zod'
import { Z_ObjectId, Z_Timestamp } from '../zod.common'
import { Z_BaseDocument, Z_BaseDocumentCreate, Z_BaseDocumentUpdate } from './zod.base'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Z_CampaignStatus = z.enum([
    'planning',
    'active',
    'paused',
    'completed',
    'archived',
])

export const Z_CampaignSubCategory = z.enum([
    'main_arc',      // Primary campaign storyline
    'side_arc',      // Secondary storyline / side quest chain
    'session_log',   // Record of a single play session
    'quest',         // Individual quest / mission
    'encounter',     // Specific encounter/scene
])

export const Z_ParticipantRole = z.enum(['dm', 'player', 'observer'])

// ─── Sub-documents ────────────────────────────────────────────────────────────

export const Z_CampaignParticipant = z.object({
    accountId: Z_ObjectId,
    characterId: Z_ObjectId.optional(),
    role: Z_ParticipantRole,
    joinedAt: z.string().optional(),
})

export const Z_SessionNote = z.object({
    sessionNumber: z.number().int().positive(),
    title: z.string().optional(),
    date: z.string().optional(),
    summary: z.string().optional(),
    notableEvents: z.array(z.string()).optional(),
    lootAwarded: z.array(z.string()).optional(),
    xpAwarded: z.number().int().nonnegative().optional(),
})

// ─── Campaign Document ────────────────────────────────────────────────────────

export const Z_Campaign = Z_BaseDocument.extend({
    subCategory: Z_CampaignSubCategory,
    status: Z_CampaignStatus,
    synopsis: z.string().optional(),
    tone: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    participants: z.array(Z_CampaignParticipant).optional(),
    sessions: z.array(Z_SessionNote).optional(),
    currentSessionNumber: z.number().int().nonnegative().optional(),
    hooks: z.array(z.object({ title: z.string(), description: z.string().optional() })).optional(),
    secrets: z.string().optional(),
    dmNotes: z.string().optional(),
})

// ─── Request Schemas ──────────────────────────────────────────────────────────

export const Z_CreateCampaignRequest = Z_BaseDocumentCreate.extend({
    subCategory: Z_CampaignSubCategory,
    status: Z_CampaignStatus.optional(),
    synopsis: z.string().max(3000).optional(),
    tone: z.string().max(200).optional(),
    startDate: z.string().optional(),
    participants: z.array(Z_CampaignParticipant).optional(),
    hooks: z.array(z.object({ title: z.string(), description: z.string().optional() })).optional(),
    dmNotes: z.string().optional(),
})

export const Z_UpdateCampaignRequest = Z_BaseDocumentUpdate.extend({
    subCategory: Z_CampaignSubCategory.optional(),
    status: Z_CampaignStatus.optional(),
    synopsis: z.string().max(3000).optional(),
    tone: z.string().max(200).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    participants: z.array(Z_CampaignParticipant).optional(),
    hooks: z.array(z.object({ title: z.string(), description: z.string().optional() })).optional(),
    dmNotes: z.string().optional(),
    secrets: z.string().optional(),
})

export const Z_AddSessionRequest = z.object({
    campaignId: Z_ObjectId,
    session: Z_SessionNote,
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_CampaignStatus = z.infer<typeof Z_CampaignStatus>
export type T_CampaignSubCategory = z.infer<typeof Z_CampaignSubCategory>
export type T_CampaignParticipant = z.infer<typeof Z_CampaignParticipant>
export type T_SessionNote = z.infer<typeof Z_SessionNote>
export type T_Campaign = z.infer<typeof Z_Campaign>
export type T_CreateCampaignRequest = z.infer<typeof Z_CreateCampaignRequest>
export type T_UpdateCampaignRequest = z.infer<typeof Z_UpdateCampaignRequest>
export type T_AddSessionRequest = z.infer<typeof Z_AddSessionRequest>
