// Common pagination types and defaults
export interface PaginationParams {
    page: number
    limit: number
    search?: string
    type?: string
}

export interface PaginationResponse {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

// Default pagination values
export const DEFAULT_PAGINATION: PaginationParams = {
    page: 1,
    limit: 12,
    search: '',
    type: ''
}

// Common pagination options
export const PAGINATION_LIMITS = [8, 12, 16, 24, 32]
export const DEFAULT_LIMIT = 12
