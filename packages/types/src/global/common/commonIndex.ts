import { I_PaginationQuery } from '../pagination'

export type T_ObjectId = string & { readonly __brand: 'ObjectId' }
export type T_Timestamp = number

export interface I_Link {
    id: string
    label: string
    href: string
    external?: boolean
    icon?: string
    className?: string
}

export interface I_Breadcrumb {
    label: string
    href: string
    current?: boolean
}

export type T_ColorVariant =
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'

export type T_Status =
    | 'active'
    | 'inactive'
    | 'pending'
    | 'archived'
    | 'deleted'

export type T_Metadata = Record<
    string,
    string | number | boolean | string[] | null | undefined
>

// Helpers

export function createObjectId(id: string): T_ObjectId {
    return id as T_ObjectId
}

export function createTimestamp(date: Date | number): T_Timestamp {
    return typeof date === 'number' ? date : date.getTime()
}

// Type guards

export function isObjectId(value: any): value is T_ObjectId {
    return typeof value === 'string' && /^[a-f0-9]{24}$/.test(value)
}

export * from './contact'
export * from './editing'
export * from './metrics'
export * from './payment'
export * from './user'
