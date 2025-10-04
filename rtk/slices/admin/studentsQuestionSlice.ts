import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface StudentsQuestionState {
    search: string
    page: number
    limit: number
    filter: string
}

export const STUDENTS_QUESTION_CONSTANTS = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 5,
} as const

const initialState: StudentsQuestionState = {
    search: '',
    page: STUDENTS_QUESTION_CONSTANTS.DEFAULT_PAGE,
    limit: STUDENTS_QUESTION_CONSTANTS.DEFAULT_LIMIT,
    filter: '',
}

const studentsQuestionSlice = createSlice({
    name: 'studentsQuestion',
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
        setFilter(state, action: PayloadAction<string>) {
            state.filter = action.payload
        },
        setPagination(state, action: PayloadAction<{ page?: number; limit?: number; search?: string; filter?: string }>) {
            if (typeof action.payload.page === 'number') state.page = action.payload.page
            if (typeof action.payload.limit === 'number') state.limit = action.payload.limit
            if (typeof action.payload.search === 'string') state.search = action.payload.search
            if (typeof action.payload.filter === 'string') state.filter = action.payload.filter
        },
        resetStudentsQuestionState() {
            return initialState
        },
    },
})

export const { 
    setSearch, 
    setPage, 
    setLimit, 
    setFilter, 
    setPagination, 
    resetStudentsQuestionState 
} = studentsQuestionSlice.actions
export default studentsQuestionSlice.reducer
