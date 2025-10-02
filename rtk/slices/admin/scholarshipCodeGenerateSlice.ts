import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Course {
    id: string
    title: string
}

interface SeriesWithCourses {
    id: string
    title: string
    created_at: string
    courses: Course[]
}

interface Student {
    id: string
    name: string
    email: string
}

interface ScholarshipCode {
    id: string
    code: string
    code_type: string
    name: string | null
    description: string | null
    scholarship_type: string
    status: number
    created_at: string
    updated_at: string
    student: {
        id: string
        name: string
        email: string
    }
    series: {
        id: string
        title: string
        slug: string
    }
    courses: Array<{
        id: string
        title: string
    }>
}

interface ScholarshipCodeGenerateState {
    selectedSeries: SeriesWithCourses | null
    selectedCourses: Course[]
    selectedStudent: Student | null
    studentName: string
    studentEmail: string
    codeType: string
    generatedCode: string
    isSuccess: boolean
    isLoading: boolean
    error: string | null
    // Table data state
    allCodesData: ScholarshipCode[]
    currentPage: number
    itemsPerPage: number
    searchQuery: string
    copiedCode: string | null
    totalItems: number
    totalPages: number
}

const initialState: ScholarshipCodeGenerateState = {
    selectedSeries: null,
    selectedCourses: [],
    selectedStudent: null,
    studentName: '',
    studentEmail: '',
    codeType: '',
    generatedCode: '',
    isSuccess: false,
    isLoading: false,
    error: null,
    // Table data initial state
    allCodesData: [],
    currentPage: 1,
    itemsPerPage: 10,
    searchQuery: '',
    copiedCode: null,
    totalItems: 0,
    totalPages: 0
}

const scholarshipCodeGenerateSlice = createSlice({
    name: 'scholarshipCodeGenerate',
    initialState,
    reducers: {
        setSelectedSeries: (state, action: PayloadAction<SeriesWithCourses | null>) => {
            state.selectedSeries = action.payload
            state.selectedCourses = [] // Reset courses when series changes
        },
        setSelectedCourses: (state, action: PayloadAction<Course[]>) => {
            state.selectedCourses = action.payload
        },
        setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
            state.selectedStudent = action.payload
            if (action.payload) {
                state.studentName = action.payload.name
                state.studentEmail = action.payload.email
            } else {
                state.studentName = ''
                state.studentEmail = ''
            }
        },
        setCodeType: (state, action: PayloadAction<string>) => {
            state.codeType = action.payload
        },
        setGeneratedCode: (state, action: PayloadAction<string>) => {
            state.generatedCode = action.payload
            state.isSuccess = true
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        resetForm: (state) => {
            state.selectedSeries = null
            state.selectedCourses = []
            state.selectedStudent = null
            state.studentName = ''
            state.studentEmail = ''
            state.codeType = ''
            // Keep generatedCode and isSuccess for display
            state.isLoading = false
            state.error = null
        },
        clearSuccess: (state) => {
            state.isSuccess = false
            state.generatedCode = ''
        },
        // Table data actions
        setAllCodesData: (state, action: PayloadAction<ScholarshipCode[]>) => {
            state.allCodesData = action.payload
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload
        },
        setItemsPerPage: (state, action: PayloadAction<number>) => {
            state.itemsPerPage = action.payload
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload
        },
        setCopiedCode: (state, action: PayloadAction<string>) => {
            state.copiedCode = action.payload
        },
        clearCopiedCode: (state) => {
            state.copiedCode = null
        },
        setPaginationData: (state, action: PayloadAction<{ totalItems: number; totalPages: number }>) => {
            state.totalItems = action.payload.totalItems
            state.totalPages = action.payload.totalPages
        }
    }
})

export const {
    setSelectedSeries,
    setSelectedCourses,
    setSelectedStudent,
    setCodeType,
    setGeneratedCode,
    setLoading,
    setError,
    resetForm,
    clearSuccess,
    setAllCodesData,
    setCurrentPage,
    setItemsPerPage,
    setSearchQuery,
    setCopiedCode,
    clearCopiedCode,
    setPaginationData
} = scholarshipCodeGenerateSlice.actions

export default scholarshipCodeGenerateSlice.reducer
