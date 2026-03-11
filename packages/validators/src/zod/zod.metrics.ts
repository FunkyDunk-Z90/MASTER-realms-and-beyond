import { z } from 'zod'

// ─── Distance ─────────────────────────────────────────────────────────────────

export const Z_Distance = z.object({
    value: z.number(),
    unit: z.enum(['mi', 'km', 'ft', 'm']),
})

// ─── Weight ───────────────────────────────────────────────────────────────────

export const Z_Weight = z.object({
    value: z.number(),
    unit: z.enum(['lb', 'kg', 'oz', 'g']),
})

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Z_Sizes = z.enum(['xs', 'sm', 'md', 'lg', 'xl', '2xl'])

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type T_Distance = z.infer<typeof Z_Distance>
export type T_Weight = z.infer<typeof Z_Weight>
export type T_Sizes = z.infer<typeof Z_Sizes>
