import { z } from 'zod'
import { Z_ObjectId, Z_Timestamp } from '../zod.common'

// ─── Codex ───────────────────────────────────────────────────────────────────
// A Codex is the top-level container for all worldbuilding content.
// Every user must have at least one Codex at all times.

// All 12 content categories — each holds an array of document ObjectIds.
const Z_CodexContent = z.object({
    worlds: z.array(Z_ObjectId).default([]),
    campaigns: z.array(Z_ObjectId).default([]),
    characters: z.array(Z_ObjectId).default([]),
    npcs: z.array(Z_ObjectId).default([]),
    bestiary: z.array(Z_ObjectId).default([]),
    ancestries: z.array(Z_ObjectId).default([]),
    lore: z.array(Z_ObjectId).default([]),
    items: z.array(Z_ObjectId).default([]),
    arcana: z.array(Z_ObjectId).default([]),
    locations: z.array(Z_ObjectId).default([]),
    nations: z.array(Z_ObjectId).default([]),
    factions: z.array(Z_ObjectId).default([]),
})

// Last 5 touched documents — most recent first.
const Z_RecentEntry = z.object({
    docId: Z_ObjectId,
    category: z.string(),
    name: z.string(),
    updatedAt: Z_Timestamp,
})

export const Z_Codex = z.object({
    _id: Z_ObjectId,
    accountId: Z_ObjectId,
    name: z.string(),
    description: z.string().optional(),
    coverImageUrl: z.string().optional(),
    isDefault: z.boolean(),
    content: Z_CodexContent,
    recent: z.array(Z_RecentEntry).max(5).default([]),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp,
})

export const Z_CreateCodexRequest = z.object({
    name: z.string().min(1, 'Codex name is required').max(80),
    description: z.string().max(500).optional(),
    coverImageUrl: z.string().optional(),
})

export const Z_UpdateCodexRequest = z.object({
    name: z.string().min(1).max(80).optional(),
    description: z.string().max(500).optional(),
    coverImageUrl: z.string().optional(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type T_Codex = z.infer<typeof Z_Codex>
export type T_CreateCodexRequest = z.infer<typeof Z_CreateCodexRequest>
export type T_UpdateCodexRequest = z.infer<typeof Z_UpdateCodexRequest>

// ─── Content inventory types ──────────────────────────────────────────────────
// Moved from @rnb/types — represents a content item summary for UI display.

export interface I_ContentItem {
    contentId: string
    contentName: string
    subCategory?: string
    worldId?: T_ObjectId
}

export interface I_AetherScribeContent {
    worlds: I_ContentItem[]
    campaigns: I_ContentItem[]
    playerCharacters: I_ContentItem[]
    npcs: I_ContentItem[]
    bestiary: I_ContentItem[]
    ancestries: I_ContentItem[]
    lore: I_ContentItem[]
    items: I_ContentItem[]
    arcana: I_ContentItem[]
    locations: I_ContentItem[]
    nations: I_ContentItem[]
    factions: I_ContentItem[]
}
