import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CourseState {
    selectedCourse: any | null
    isLoading: boolean
    error: string | null
}

const initialState: CourseState = {
    selectedCourse: null,
    isLoading: false,
    error: null
}

const allCourseListSlice = createSlice({
    name: 'allCourseList',
    initialState,
    reducers: {
        setSelectedCourse: (state, action: PayloadAction<any>) => {
            state.selectedCourse = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        clearCourse: (state) => {
            state.selectedCourse = null
            state.error = null
        }
    }
})

export const { setSelectedCourse, setLoading, setError, clearCourse } = allCourseListSlice.actions
export default allCourseListSlice.reducer