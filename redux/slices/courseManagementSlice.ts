import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { DateRange } from 'react-day-picker'
import { createCourse } from '@/lib/apis/courseManagementApis'

// Types
export interface Lesson {
    id: string
    title: string
    videoFile: File | null
    documentFiles: File[]
}

export interface Course {
    id: string
    title: string
    lessons_files: {
        title: string
    }[]
    price: number
    introVideo: File | null
    endVideo: File | null
    videoFiles: File[]
    docFiles: File[]
}

export interface CourseFormData {
    title: string
    codeType: string
    available_site: number
    course_type: string
    description: string
    note: string
    price: number
    thumbnail: File | null
    start_date: string
    end_date: string
    courses: Course[]
    dateRange: DateRange | undefined
}

export interface CourseManagementState {
    // Form data
    courseForm: CourseFormData

    // UI states
    isLoading: boolean
    isSubmitting: boolean
    showModuleForm: boolean
    showErrors: boolean
    validationErrors: string[]

    // Module-specific states
    modulePrices: { [key: string]: number }
    moduleIntroVideos: { [key: string]: { enabled: boolean, file: File | null } }
    moduleEndVideos: { [key: string]: { enabled: boolean, file: File | null } }
    moduleLessons: { [key: string]: Lesson[] }

    // Success/error states
    error: string | null
    successMessage: string | null
}

const initialState: CourseManagementState = {
    courseForm: {
        title: '',
        codeType: '',
        available_site: 0,
        course_type: '',
        description: '',
        note: '',
        price: 0,
        thumbnail: null,
        start_date: '',
        end_date: '',
        courses: [],
        dateRange: undefined
    },
    isLoading: false,
    isSubmitting: false,
    showModuleForm: false,
    showErrors: false,
    validationErrors: [],
    modulePrices: {},
    moduleIntroVideos: {},
    moduleEndVideos: {},
    moduleLessons: {},
    error: null,
    successMessage: null
}

// Async thunk for creating course
export const createCourseAsync = createAsyncThunk(
    'courseManagement/createCourse',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const result = await createCourse(formData)
            return result
        } catch (error: any) {
            // Extract error message from API response
            let errorMessage = 'Error creating course. '
            if (error.response?.data?.message) {
                // Use API response message if available
                errorMessage = error.response.data.message
            } else if (error.response?.status === 401) {
                errorMessage += 'Authentication required. Please login again.'
            } else if (error.response?.status === 403) {
                errorMessage += 'Access denied. You may not have permission.'
            } else if (error.response?.status === 404) {
                errorMessage += 'API endpoint not found. Check server configuration.'
            } else if (error.response?.status >= 500) {
                errorMessage += 'Server error. Please try again later.'
            } else if (error.code === 'NETWORK_ERROR') {
                errorMessage += 'Network error. Check your connection.'
            } else {
                errorMessage += error.message || 'Unknown error occurred.'
            }
            return rejectWithValue(errorMessage)
        }
    }
)

const courseManagementSlice = createSlice({
    name: 'courseManagement',
    initialState,
    reducers: {
        // Form field updates
        updateCourseForm: (state, action: PayloadAction<Partial<CourseFormData>>) => {
            state.courseForm = { ...state.courseForm, ...action.payload }
        },

        updateCourseField: (state, action: PayloadAction<{ field: keyof CourseFormData, value: any }>) => {
            const { field, value } = action.payload
                ; (state.courseForm as any)[field] = value
        },

        // Module management
        addModule: (state, action: PayloadAction<Course>) => {
            const newModule = action.payload
            state.courseForm.courses.push(newModule)

            // Initialize module states
            state.modulePrices[newModule.id] = newModule.price
            state.moduleIntroVideos[newModule.id] = { enabled: false, file: null }
            state.moduleEndVideos[newModule.id] = { enabled: true, file: null }
            state.moduleLessons[newModule.id] = []
        },

        removeModule: (state, action: PayloadAction<{ moduleId: string, index: number }>) => {
            const { moduleId, index } = action.payload

            // Remove from courses array
            state.courseForm.courses.splice(index, 1)

            // Clean up module states
            delete state.modulePrices[moduleId]
            delete state.moduleIntroVideos[moduleId]
            delete state.moduleEndVideos[moduleId]
            delete state.moduleLessons[moduleId]

            // Hide form if no modules left
            if (state.courseForm.courses.length === 0) {
                state.showModuleForm = false
            }
        },

        updateModuleField: (state, action: PayloadAction<{ moduleId: string, field: keyof Course, value: any }>) => {
            const { moduleId, field, value } = action.payload
            const moduleIndex = state.courseForm.courses.findIndex(course => course.id === moduleId)
            if (moduleIndex !== -1) {
                ; (state.courseForm.courses[moduleIndex] as any)[field] = value
            }
        },

        updateModulePrice: (state, action: PayloadAction<{ moduleId: string, price: number }>) => {
            const { moduleId, price } = action.payload
            state.modulePrices[moduleId] = price
            const moduleIndex = state.courseForm.courses.findIndex(course => course.id === moduleId)
            if (moduleIndex !== -1) {
                state.courseForm.courses[moduleIndex].price = price
            }
            state.courseForm.price = Object.values(state.modulePrices).reduce((sum, p) => sum + p, 0)
        },

        updateModuleIntroVideo: (state, action: PayloadAction<{ moduleId: string, enabled?: boolean, file?: File | null }>) => {
            const { moduleId, enabled, file } = action.payload
            const currentState = state.moduleIntroVideos[moduleId] || { enabled: false, file: null }

            state.moduleIntroVideos[moduleId] = {
                enabled: enabled !== undefined ? enabled : currentState.enabled,
                file: file !== undefined ? file : currentState.file
            }

            const moduleIndex = state.courseForm.courses.findIndex(course => course.id === moduleId)
            if (moduleIndex !== -1) {
                state.courseForm.courses[moduleIndex].introVideo = state.moduleIntroVideos[moduleId].file
            }
        },

        updateModuleEndVideo: (state, action: PayloadAction<{ moduleId: string, enabled?: boolean, file?: File | null }>) => {
            const { moduleId, enabled, file } = action.payload
            const currentState = state.moduleEndVideos[moduleId] || { enabled: true, file: null }

            state.moduleEndVideos[moduleId] = {
                enabled: enabled !== undefined ? enabled : currentState.enabled,
                file: file !== undefined ? file : currentState.file
            }

            const moduleIndex = state.courseForm.courses.findIndex(course => course.id === moduleId)
            if (moduleIndex !== -1) {
                state.courseForm.courses[moduleIndex].endVideo = state.moduleEndVideos[moduleId].file
            }
        },

        updateModuleLessons: (state, action: PayloadAction<{ moduleId: string, lessons: Lesson[] }>) => {
            const { moduleId, lessons } = action.payload
            state.moduleLessons[moduleId] = lessons
            const moduleIndex = state.courseForm.courses.findIndex(course => course.id === moduleId)
            if (moduleIndex !== -1) {
                state.courseForm.courses[moduleIndex].videoFiles = lessons.map(l => l.videoFile).filter(Boolean) as File[]
                state.courseForm.courses[moduleIndex].docFiles = lessons.flatMap(l => l.documentFiles)
                state.courseForm.courses[moduleIndex].lessons_files = lessons.map(l => ({ title: l.title }))
            }
        },

        // UI state updates
        setShowModuleForm: (state, action: PayloadAction<boolean>) => {
            state.showModuleForm = action.payload
        },

        setShowErrors: (state, action: PayloadAction<boolean>) => {
            state.showErrors = action.payload
        },

        setValidationErrors: (state, action: PayloadAction<string[]>) => {
            state.validationErrors = action.payload
        },

        // Reset states
        resetForm: (state) => {
            return initialState
        },

        clearError: (state) => {
            state.error = null
        },

        clearSuccess: (state) => {
            state.successMessage = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCourseAsync.pending, (state) => {
                state.isSubmitting = true
                state.error = null
                state.successMessage = null
            })
            .addCase(createCourseAsync.fulfilled, (state, action) => {
                const successMessage = action.payload?.message || 'Course created successfully!'
                return { ...initialState, successMessage }
            })
            .addCase(createCourseAsync.rejected, (state, action) => {
                state.isSubmitting = false
                state.error = action.payload as string
            })
    }
})

export const {
    updateCourseForm,
    updateCourseField,
    addModule,
    removeModule,
    updateModuleField,
    updateModulePrice,
    updateModuleIntroVideo,
    updateModuleEndVideo,
    updateModuleLessons,
    setShowModuleForm,
    setShowErrors,
    setValidationErrors,
    resetForm,
    clearError,
    clearSuccess
} = courseManagementSlice.actions

export default courseManagementSlice.reducer