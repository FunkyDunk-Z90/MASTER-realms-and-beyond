import { z } from 'zod'
import { Z_ObjectId, Z_Timestamp } from './zod.common'

// ─── Note ──────────────────────────────────────────────────────────────────────

export const Z_Note = z.object({
    id: Z_ObjectId,
    authorId: Z_ObjectId,
    content: z.string(),
    createdAt: Z_Timestamp,
    updatedAt: Z_Timestamp.optional(),
    tags: z.array(z.string()).optional(),
})

// ─── Paragraph ─────────────────────────────────────────────────────────────────

export const Z_Paras = z.object({
    id: z.string(),
    content: z.string(),
    type: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']),
    order: z.number(),
})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type T_Note = z.infer<typeof Z_Note>
export type T_Paras = z.infer<typeof Z_Paras>
