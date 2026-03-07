import { I_PaginationQuery } from './pagination'

export type T_ObjectId = string & { readonly __brand: 'ObjectId' }
export type T_Timestamp = number

export interface I_User {
    id: T_ObjectId
    email: string
    firstName: string
    lastName: string
    avatar?: string
    createdAt: T_Timestamp
    updatedAt: T_Timestamp
}

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

export type T_Sizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

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

export interface I_Note {
    id: T_ObjectId
    authorId: T_ObjectId
    content: string
    createdAt: T_Timestamp
    updatedAt?: T_Timestamp
    tags?: string[]
}

export interface I_Paras {
    id: string
    content: string
    type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
    order: number
}

export interface I_Distance {
    value: number
    unit: 'mi' | 'km' | 'ft' | 'm'
}

export interface I_Weight {
    value: number
    unit: 'lb' | 'kg' | 'oz' | 'g'
}

export type T_Metadata = Record<
    string,
    string | number | boolean | string[] | null | undefined
>

export interface I_FilterCriteria {
    field: string
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'regex'
    value: any
}

export interface I_SearchQuery {
    q: string
    fields?: string[]
    pagination?: I_PaginationQuery
    filters?: I_FilterCriteria[]
}

export interface I_SearchResults<T> {
    results: T[]
    relevanceScores: Record<string, number>
    total: number
}

export interface I_FileInfo {
    filename: string
    mimeType: string
    size: number
    url: string
    uploadedAt: T_Timestamp
    publicId?: string
}

export interface I_AuditLog {
    id: T_ObjectId
    entityType: string
    entityId: T_ObjectId
    userId: T_ObjectId
    action: 'create' | 'update' | 'delete' | 'read'
    changes?: {
        field: string
        oldValue: any
        newValue: any
    }[]
    ipAddress?: string
    timestamp: T_Timestamp
}

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
