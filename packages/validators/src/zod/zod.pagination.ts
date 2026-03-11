import { z } from 'zod'

export const Z_PaginationQuery = z.object({
    limit: z.number().int().positive(),
    offset: z.number().int().nonnegative(),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional(),
})

export const Z_Pagination = z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    hasMore: z.boolean(),
})

export type T_PaginationQuery = z.infer<typeof Z_PaginationQuery>
export type T_Pagination = z.infer<typeof Z_Pagination>
