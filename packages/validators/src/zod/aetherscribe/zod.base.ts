import { z } from 'zod'
import { Z_ObjectId, Z_Timestamp } from '../zod.common'

// ─── Shared Enums ─────────────────────────────────────────────────────────────

export const Z_Ruleset = z.enum(['generic', 'dnd_5e_24', 'aetherscape'])
export const Z_WorldVisibility = z.enum(['private', 'friends_only', 'public'])
export const Z_CollaboratorRole = z.enum(['viewer', 'editor', 'admin'])

// ─── Base Document ────────────────────────────────────────────────────────────
// Shared read-shape for all codex content documents.

export const Z_BaseDocument = z.object({
    id: Z_ObjectId,
    codexId: Z_ObjectId,
    accountId: Z_ObjectId,
    worldId: Z_ObjectId.optional(),
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()),
    isPrivate: z.boolean(),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
    version: z.number().int(),
})

// ─── Base Create / Update inputs ──────────────────────────────────────────────

export const Z_BaseDocumentCreate = z.object({
    codexId: Z_ObjectId,
    worldId: Z_ObjectId.optional(),
    name: z.string().min(1, 'Name is required').max(120),
    description: z.string().max(2000).optional(),
    notes: z.string().optional(),
    tags: z.array(z.string().max(40)).max(20).optional(),
    isPrivate: z.boolean().optional(),
})

export const Z_BaseDocumentUpdate = z.object({
    worldId: Z_ObjectId.optional(),
    name: z.string().min(1).max(120).optional(),
    description: z.string().max(2000).optional(),
    notes: z.string().optional(),
    tags: z.array(z.string().max(40)).max(20).optional(),
    isPrivate: z.boolean().optional(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_Ruleset = z.infer<typeof Z_Ruleset>
export type T_WorldVisibility = z.infer<typeof Z_WorldVisibility>
export type T_CollaboratorRole = z.infer<typeof Z_CollaboratorRole>
export type T_BaseDocument = z.infer<typeof Z_BaseDocument>
export type T_BaseDocumentCreate = z.infer<typeof Z_BaseDocumentCreate>
export type T_BaseDocumentUpdate = z.infer<typeof Z_BaseDocumentUpdate>
