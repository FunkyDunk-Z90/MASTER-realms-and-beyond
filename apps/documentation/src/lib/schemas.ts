import { z } from 'zod'

// ─── Navigation ───────────────────────────────────────────────────────────────

export const Z_NavSection = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
  subsections: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        href: z.string(),
      })
    )
    .optional(),
})

export type T_NavSection = z.infer<typeof Z_NavSection>

export const Z_NavSections = z.array(Z_NavSection)
export type T_NavSections = z.infer<typeof Z_NavSections>

// ─── Tech Stack ───────────────────────────────────────────────────────────────

export const Z_TechStackEntry = z.object({
  concern: z.string(),
  technology: z.string(),
  badge: z.string().optional(),
})

export type T_TechStackEntry = z.infer<typeof Z_TechStackEntry>

export const Z_TechStack = z.object({
  label: z.string(),
  entries: z.array(Z_TechStackEntry),
})

export type T_TechStack = z.infer<typeof Z_TechStack>

// ─── Package ──────────────────────────────────────────────────────────────────

export const Z_Package = z.object({
  name: z.string(),
  path: z.string(),
  description: z.string(),
  consumedBy: z.string(),
  exports: z.array(z.string()).optional(),
})

export type T_Package = z.infer<typeof Z_Package>

// ─── Product ──────────────────────────────────────────────────────────────────

export const Z_Product = z.object({
  name: z.string(),
  type: z.string(),
  purpose: z.string(),
  icon: z.string().optional(),
})

export type T_Product = z.infer<typeof Z_Product>

// ─── Code Convention ──────────────────────────────────────────────────────────

export const Z_Convention = z.object({
  type: z.string(),
  convention: z.string(),
  example: z.string(),
})

export type T_Convention = z.infer<typeof Z_Convention>

// ─── Search ──────────────────────────────────────────────────────────────────

export const Z_SearchQuery = z.object({
  query: z.string().min(1).max(200),
})

export type T_SearchQuery = z.infer<typeof Z_SearchQuery>

// ─── Theme ───────────────────────────────────────────────────────────────────

export const Z_ThemeName = z.enum(['arcade', 'phosphor', 'sovereign', 'void', 'dusk', 'parchment'])
export type T_ThemeName = z.infer<typeof Z_ThemeName>

// ─── Section visibility ───────────────────────────────────────────────────────

export const Z_ActiveSection = z.string()
export type T_ActiveSection = z.infer<typeof Z_ActiveSection>
