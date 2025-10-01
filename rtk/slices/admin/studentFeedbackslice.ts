import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface StudentFeedbackState {
    search: string
    type: string
    page: number
    limit: number
    selectedId?: string | null
    selectedStatus?: 'pending' | 'approved' | 'rejected' | null
}

export const STUDENT_FEEDBACK_CONSTANTS = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
} as const

const initialState: StudentFeedbackState = {
    search: '',
    type: '',
    page: STUDENT_FEEDBACK_CONSTANTS.DEFAULT_PAGE,
    limit: STUDENT_FEEDBACK_CONSTANTS.DEFAULT_LIMIT,
    selectedId: null,
    selectedStatus: null,
}

const studentFeedbackSlice = createSlice({
    name: 'studentFeedback',
    initialState,
    reducers: {
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload
        },
        setType(state, action: PayloadAction<string>) {
            state.type = action.payload
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
        setSelectedId(state, action: PayloadAction<string | null | undefined>) {
            state.selectedId = action.payload ?? null
        },
        setSelectedStatus(state, action: PayloadAction<'pending' | 'approved' | 'rejected' | null | undefined>) {
            state.selectedStatus = (action.payload ?? null) as any
        },
        resetStudentFeedbackState() {
            return initialState
        },
    },
})

export const { setSearch, setType, setPage, setLimit, setPagination, setSelectedId, setSelectedStatus, resetStudentFeedbackState } = studentFeedbackSlice.actions
export default studentFeedbackSlice.reducer


