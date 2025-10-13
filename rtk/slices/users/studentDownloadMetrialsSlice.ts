import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type LectureType = 'lecture-slides' | 'video-lectures' | 'audio-lessons' | 'other-document'

export interface StudentDownloadMaterialsFilters {
    series_id?: string
    course_id?: string
    lecture_type: LectureType
    page: number
    limit: number
}

const initialState: StudentDownloadMaterialsFilters = {
    series_id: undefined,
    course_id: undefined,
    lecture_type: 'lecture-slides',
    page: 1,
    limit: 12,
}

const studentDownloadMetrialsSlice = createSlice({
    name: 'studentDownloadMetrials',
    initialState,
    reducers: {
        setSeriesId(state, action: PayloadAction<string | undefined>) {
            state.series_id = action.payload
            // Reset course when series changes
            if (!action.payload) state.course_id = undefined
            state.page = 1
        },
        setCourseId(state, action: PayloadAction<string | undefined>) {
            state.course_id = action.payload
            state.page = 1
        },
        setLectureType(state, action: PayloadAction<LectureType>) {
            state.lecture_type = action.payload
            state.page = 1
        },
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload
        },
        setLimit(state, action: PayloadAction<number>) {
            state.limit = action.payload
            state.page = 1
        },
        resetFilters() {
            return initialState
        },
    },
})

export const { setSeriesId, setCourseId, setLectureType, setPage, setLimit, resetFilters } = studentDownloadMetrialsSlice.actions
export default studentDownloadMetrialsSlice.reducer
