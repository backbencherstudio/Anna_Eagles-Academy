import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DateRange } from 'react-day-picker'

// ============================================================================
// CONSTANTS
// ============================================================================
export const PAGINATION_CONSTANTS = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 8,
    ITEMS_PER_PAGE_OPTIONS: [4, 8, 12, 16, 20] as number[]
} as const

// ============================================================================
// TYPES
// ============================================================================

// Core Types
export interface Lesson {
    id: string
    title: string
    videoFile: File | null
    documentFiles: File[]
}

export interface LessonFile {
    title: string
}

// API Response Types
export interface ApiCourse {
    id: string
    title: string
    slug: string
    summary: string | null
    description: string
    visibility: string
    video_length: string | null
    duration: string | null
    start_date: string | null
    end_date: string | null
    thumbnail: string
    total_price: string
    course_type: string
    note: string
    available_site: number
    created_at: string
    updated_at: string
    language: unknown
    courses: unknown[]
    _count: {
        courses: number
        quizzes: number
        assignments: number
    }
    thumbnail_url: string
}

export interface PaginationInfo {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export interface CoursesResponse {
    success: boolean
    message: string
    data: {
        series: ApiCourse[]
        pagination: PaginationInfo
    }
}

// Form Types
export interface Course {
    id: string
    title: string
    lessons_files: LessonFile[]
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
    start_date: string | null
    end_date: string | null
    courses: Course[]
    dateRange: DateRange | undefined
}

// Module State Types
export interface ModuleVideoState {
    enabled: boolean
    file: File | null
}

export interface ModuleState {
    prices: Record<string, number>
    introVideos: Record<string, ModuleVideoState>
    endVideos: Record<string, ModuleVideoState>
    lessons: Record<string, Lesson[]>
}

// ============================================================================
// STATE INTERFACE
// ============================================================================
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
    modulePrices: Record<string, number>
    moduleIntroVideos: Record<string, ModuleVideoState>
    moduleEndVideos: Record<string, ModuleVideoState>
    moduleLessons: Record<string, Lesson[]>

    // Course list states
    courses: ApiCourse[]
    pagination: PaginationInfo
    searchQuery: string
    localSearchQuery: string

    // Success/error states
    error: string | null
    successMessage: string | null
}

// ============================================================================
// INITIAL STATE
// ============================================================================
const createInitialCourseForm = (): CourseFormData => ({
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
})

const createInitialPagination = (): PaginationInfo => ({
    total: 0,
    page: PAGINATION_CONSTANTS.DEFAULT_PAGE,
    limit: PAGINATION_CONSTANTS.DEFAULT_LIMIT,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
})

const initialState: CourseManagementState = {
    courseForm: createInitialCourseForm(),
    isLoading: false,
    isSubmitting: false,
    showModuleForm: false,
    showErrors: false,
    validationErrors: [],
    modulePrices: {},
    moduleIntroVideos: {},
    moduleEndVideos: {},
    moduleLessons: {},
    courses: [],
    pagination: createInitialPagination(),
    searchQuery: '',
    localSearchQuery: '',
    error: null,
    successMessage: null
}


// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const findModuleIndex = (courses: Course[], moduleId: string): number => 
    courses.findIndex(course => course.id === moduleId)

const calculateTotalPrice = (modulePrices: Record<string, number>): number =>
    Object.values(modulePrices).reduce((sum, price) => sum + price, 0)

// ============================================================================
// SLICE
// ============================================================================
const courseManagementSlice = createSlice({
    name: 'courseManagement',
    initialState,
    reducers: {
        // ========================================================================
        // FORM ACTIONS
        // ========================================================================
        updateCourseForm: (state, action: PayloadAction<Partial<CourseFormData>>) => {
            state.courseForm = { ...state.courseForm, ...action.payload }
        },

        updateCourseField: <K extends keyof CourseFormData>(
            state: CourseManagementState, 
            action: PayloadAction<{ field: K, value: CourseFormData[K] }>
        ) => {
            const { field, value } = action.payload
            state.courseForm[field] = value
        },

        // ========================================================================
        // MODULE ACTIONS
        // ========================================================================
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

        updateModuleField: <K extends keyof Course>(
            state: CourseManagementState,
            action: PayloadAction<{ moduleId: string, field: K, value: Course[K] }>
        ) => {
            const { moduleId, field, value } = action.payload
            const moduleIndex = findModuleIndex(state.courseForm.courses, moduleId)
            if (moduleIndex !== -1) {
                state.courseForm.courses[moduleIndex][field] = value
            }
        },

        updateModulePrice: (state, action: PayloadAction<{ moduleId: string, price: number }>) => {
            const { moduleId, price } = action.payload
            state.modulePrices[moduleId] = price
            
            const moduleIndex = findModuleIndex(state.courseForm.courses, moduleId)
            if (moduleIndex !== -1) {
                state.courseForm.courses[moduleIndex].price = price
            }
            
            state.courseForm.price = calculateTotalPrice(state.modulePrices)
        },

        updateModuleIntroVideo: (state, action: PayloadAction<{ moduleId: string, enabled?: boolean, file?: File | null }>) => {
            const { moduleId, enabled, file } = action.payload
            const currentState = state.moduleIntroVideos[moduleId] || { enabled: false, file: null }

            state.moduleIntroVideos[moduleId] = {
                enabled: enabled ?? currentState.enabled,
                file: file ?? currentState.file
            }

            const moduleIndex = findModuleIndex(state.courseForm.courses, moduleId)
            if (moduleIndex !== -1) {
                state.courseForm.courses[moduleIndex].introVideo = state.moduleIntroVideos[moduleId].file
            }
        },

        updateModuleEndVideo: (state, action: PayloadAction<{ moduleId: string, enabled?: boolean, file?: File | null }>) => {
            const { moduleId, enabled, file } = action.payload
            const currentState = state.moduleEndVideos[moduleId] || { enabled: true, file: null }

            state.moduleEndVideos[moduleId] = {
                enabled: enabled ?? currentState.enabled,
                file: file ?? currentState.file
            }

            const moduleIndex = findModuleIndex(state.courseForm.courses, moduleId)
            if (moduleIndex !== -1) {
                state.courseForm.courses[moduleIndex].endVideo = state.moduleEndVideos[moduleId].file
            }
        },

        updateModuleLessons: (state, action: PayloadAction<{ moduleId: string, lessons: Lesson[] }>) => {
            const { moduleId, lessons } = action.payload
            state.moduleLessons[moduleId] = lessons
            
            const moduleIndex = findModuleIndex(state.courseForm.courses, moduleId)
            if (moduleIndex !== -1) {
                const module = state.courseForm.courses[moduleIndex]
                module.videoFiles = lessons.map(l => l.videoFile).filter(Boolean) as File[]
                module.docFiles = lessons.flatMap(l => l.documentFiles)
                module.lessons_files = lessons.map(l => ({ title: l.title }))
            }
        },

        // ========================================================================
        // UI ACTIONS
        // ========================================================================
        setShowModuleForm: (state, action: PayloadAction<boolean>) => {
            state.showModuleForm = action.payload
        },

        setShowErrors: (state, action: PayloadAction<boolean>) => {
            state.showErrors = action.payload
        },

        setValidationErrors: (state, action: PayloadAction<string[]>) => {
            state.validationErrors = action.payload
        },

        // ========================================================================
        // SEARCH & PAGINATION ACTIONS
        // ========================================================================
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload
        },

        setLocalSearchQuery: (state, action: PayloadAction<string>) => {
            state.localSearchQuery = action.payload
        },

        setPagination: (state, action: PayloadAction<{ page: number, limit: number }>) => {
            state.pagination.page = action.payload.page
            state.pagination.limit = action.payload.limit
        },

        // ========================================================================
        // RESET & CLEAR ACTIONS
        // ========================================================================
        resetForm: (state) => {
            // Preserve course list data while resetting form
            const preservedData = {
                courses: state.courses,
                pagination: state.pagination,
                searchQuery: state.searchQuery,
                localSearchQuery: state.localSearchQuery
            }
            return { ...initialState, ...preservedData }
        },

        clearError: (state) => {
            state.error = null
        },

        clearSuccess: (state) => {
            state.successMessage = null
        }
    }
})

// ============================================================================
// EXPORTS
// ============================================================================

// Action creators
export const {
    // Form actions
    updateCourseForm,
    updateCourseField,
    
    // Module actions
    addModule,
    removeModule,
    updateModuleField,
    updateModulePrice,
    updateModuleIntroVideo,
    updateModuleEndVideo,
    updateModuleLessons,
    
    // UI actions
    setShowModuleForm,
    setShowErrors,
    setValidationErrors,
    
    // Search & pagination actions
    setSearchQuery,
    setLocalSearchQuery,
    setPagination,
    
    // Reset & clear actions
    resetForm,
    clearError,
    clearSuccess
} = courseManagementSlice.actions

// Reducer
export default courseManagementSlice.reducer
