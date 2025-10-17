import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type FeedbackType = 'course_review' | 'series_review'

export interface ShareFeedbackState {
    seriesId?: string
    courseId?: string
    title: string
    description: string
    type: FeedbackType
    submitting: boolean
    error?: string | null
    success: boolean
}

const initialState: ShareFeedbackState = {
    seriesId: undefined,
    courseId: undefined,
    title: '',
    description: '',
    type: 'course_review',
    submitting: false,
    error: null,
    success: false,
}

const shareFeedBackSlice = createSlice({
    name: 'shareFeedback',
    initialState,
    reducers: {
        setSeriesId(state, action: PayloadAction<string | undefined>) {
            state.seriesId = action.payload
            // reset course if series changes
            state.courseId = undefined
        },
        setCourseId(state, action: PayloadAction<string | undefined>) {
            state.courseId = action.payload
        },
        setTitle(state, action: PayloadAction<string>) {
            state.title = action.payload
        },
        setDescription(state, action: PayloadAction<string>) {
            state.description = action.payload
        },
        setType(state, action: PayloadAction<FeedbackType>) {
            state.type = action.payload
        },
        setSubmitting(state, action: PayloadAction<boolean>) {
            state.submitting = action.payload
        },
        setError(state, action: PayloadAction<string | null | undefined>) {
            state.error = action.payload ?? null
        },
        setSuccess(state, action: PayloadAction<boolean>) {
            state.success = action.payload
        },
        resetFeedbackForm() {
            return { ...initialState }
        },
    },
})

export const {
    setSeriesId,
    setCourseId,
    setTitle,
    setDescription,
    setType,
    setSubmitting,
    setError,
    setSuccess,
    resetFeedbackForm,
} = shareFeedBackSlice.actions

export default shareFeedBackSlice.reducer


