import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AssignmentEssayEvaluationQueryState {
    page: number
    limit: number
    search: string
    seriesId: string
    courseId: string
}

const initialState: AssignmentEssayEvaluationQueryState = {
    page: 1,
    limit: 8,
    search: '',
    seriesId: 'all',
    courseId: 'all',
}

const assignmentEssayEvaluationSlice = createSlice({
    name: 'assignmentEssayEvaluation',
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload
        },
        setLimit(state, action: PayloadAction<number>) {
            state.limit = action.payload
            state.page = 1
        },
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload
            state.page = 1
        },
        setSeriesId(state, action: PayloadAction<string>) {
            state.seriesId = action.payload
            state.courseId = 'all'
            state.page = 1
        },
        setCourseId(state, action: PayloadAction<string>) {
            state.courseId = action.payload
            state.page = 1
        },
        resetFilters(state) {
            state.search = ''
            state.seriesId = 'all'
            state.courseId = 'all'
            state.page = 1
            state.limit = 8
        }
    }
})

export const { setPage, setLimit, setSearch, setSeriesId, setCourseId, resetFilters } = assignmentEssayEvaluationSlice.actions
export default assignmentEssayEvaluationSlice.reducer
