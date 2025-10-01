import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CardGeneratorState {
    search: string
    page: number
    limit: number
}

export const CARD_GENERATOR_CONSTANTS = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
} as const

const initialState: CardGeneratorState = {
    search: '',
    page: CARD_GENERATOR_CONSTANTS.DEFAULT_PAGE,
    limit: CARD_GENERATOR_CONSTANTS.DEFAULT_LIMIT,
}

const cardGeneratorSlice = createSlice({
    name: 'cardGenerator',
    initialState,
    reducers: {
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload
        },
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload
        },
        setLimit(state, action: PayloadAction<number>) {
            state.limit = action.payload
        },
        setPagination(state, action: PayloadAction<{ page?: number; limit?: number }>) {
            if (typeof action.payload.page === 'number') state.page = action.payload.page
            if (typeof action.payload.limit === 'number') state.limit = action.payload.limit
        },
        resetCardGeneratorState() {
            return initialState
        },
    },
})

export const { setSearch, setPage, setLimit, setPagination, resetCardGeneratorState } = cardGeneratorSlice.actions
export default cardGeneratorSlice.reducer

