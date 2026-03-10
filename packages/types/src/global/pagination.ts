export interface I_PaginationQuery {
    limit: number
    offset: number
    sort?: string
    order?: 'asc' | 'desc'
}

export interface I_Pagination {
    total: number
    limit: number
    offset: number
    hasMore: boolean
}
export function isPaginationQuery(value: any): value is I_PaginationQuery {
    return (
        typeof value === 'object' &&
        typeof value.limit === 'number' &&
        typeof value.offset === 'number'
    )
}
