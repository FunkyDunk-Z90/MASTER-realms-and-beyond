import { Types } from 'mongoose'
import { z } from 'zod'

export const Z_ObjectId = z.union([
    z.string(),
    z.custom<Types.ObjectId>((val) => val instanceof Types.ObjectId),
])

export const Z_Timestamp = z.number()

export const Z_Link = z.object({
    id: z.string(),
    label: z.string(),
    href: z.string(),
    external: z.boolean().optional(),
    icon: z.string().optional(),
    className: z.string().optional(),
})

export const Z_Breadcrumb = z.object({
    label: z.string(),
    href: z.string(),
    current: z.boolean().optional(),
})

export const Z_ColorVariant = z.enum([
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
])

export const Z_Status = z.enum([
    'active',
    'inactive',
    'pending',
    'archived',
    'deleted',
])

export const Z_Metadata = z.record(
    z.string(),
    z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.array(z.string()),
        z.null(),
        z.undefined(),
    ])
)

export type T_ObjectId = z.infer<typeof Z_ObjectId>
export type T_Timestamp = z.infer<typeof Z_Timestamp>
export type T_Link = z.infer<typeof Z_Link>
export type T_Breadcrumb = z.infer<typeof Z_Breadcrumb>
export type T_ColorVariant = z.infer<typeof Z_ColorVariant>
export type T_Status = z.infer<typeof Z_Status>
export type T_Metadata = z.infer<typeof Z_Metadata>
