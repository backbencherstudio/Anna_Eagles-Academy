import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// ============================================================================
// TYPES
// ============================================================================

export interface Essay {
    id: string
    title: string
    points: number
    submissionDeadline: string 
}

export interface AdditionalQuestion {
    id: string
    assignmentTitle: string
    points: number
}

export interface AssignmentFormData {
    mainTitle: string
    selectedSeries: string
    selectedCourses: string
    assignmentTitle: string
    points: number
    submissionDeadline: string 
}

export interface AssignmentState {
    // Form data
    formData: AssignmentFormData
    
    // Essays management
    essays: Essay[]
    selectedEssayId: string
    essaysCount: number
    
    // Additional questions
    additionalQuestions: AdditionalQuestion[]
    
    // UI state
    isLoading: boolean
    error: string | null
    
    // Assignment creation
    isCreatingAssignment: boolean
    createdAssignmentId: string | null
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: AssignmentState = {
    formData: {
        mainTitle: '',
        selectedSeries: '',
        selectedCourses: '',
        assignmentTitle: '',
        points: 20,
        submissionDeadline: new Date().toISOString() // Convert to string
    },
    essays: [],
    selectedEssayId: '',
    essaysCount: 0,
    additionalQuestions: [],
    isLoading: false,
    error: null,
    isCreatingAssignment: false,
    createdAssignmentId: null
}

// ============================================================================
// SLICE
// ============================================================================

const assignmentManagementSlice = createSlice({
    name: 'assignmentManagement',
    initialState,
    reducers: {
        // Form data actions
        updateFormField: (state, action: PayloadAction<{ field: keyof AssignmentFormData; value: string | number }>) => {
            const { field, value } = action.payload
            ;(state.formData as any)[field] = value
        },
        
        resetForm: (state) => {
            state.formData = {
                mainTitle: state.formData.mainTitle,
                selectedSeries: state.formData.selectedSeries,
                selectedCourses: state.formData.selectedCourses,
                assignmentTitle: '',
                points: 20,
                submissionDeadline: state.formData.submissionDeadline
            }
            state.selectedEssayId = ''
            state.additionalQuestions = []
        },
        
        // Essay management actions
        addEssay: (state, action: PayloadAction<Essay>) => {
            state.essays.push(action.payload)
            state.essaysCount = state.essays.length
        },
        
        updateEssay: (state, action: PayloadAction<{ id: string; essay: Essay }>) => {
            const { id, essay } = action.payload
            const index = state.essays.findIndex(e => e.id === id)
            if (index !== -1) {
                state.essays[index] = essay
            }
        },
        
        deleteEssay: (state, action: PayloadAction<string>) => {
            const essayId = action.payload
            state.essays = state.essays.filter(e => e.id !== essayId)
            state.essaysCount = state.essays.length
            
            if (state.selectedEssayId === essayId) {
                state.selectedEssayId = ''
            }
        },
        
        selectEssay: (state, action: PayloadAction<string>) => {
            state.selectedEssayId = action.payload
        },
        
        clearAllEssays: (state) => {
            state.essays = []
            state.selectedEssayId = ''
            state.essaysCount = 0
        },
        
        // Additional questions actions
        addAdditionalQuestion: (state, action: PayloadAction<AdditionalQuestion>) => {
            state.additionalQuestions.push(action.payload)
        },
        
        updateAdditionalQuestion: (state, action: PayloadAction<{ id: string; question: AdditionalQuestion }>) => {
            const { id, question } = action.payload
            const index = state.additionalQuestions.findIndex(q => q.id === id)
            if (index !== -1) {
                state.additionalQuestions[index] = question
            }
        },
        
        removeAdditionalQuestion: (state, action: PayloadAction<string>) => {
            const questionId = action.payload
            state.additionalQuestions = state.additionalQuestions.filter(q => q.id !== questionId)
        },
        
        clearAdditionalQuestions: (state) => {
            state.additionalQuestions = []
        },
        
        // Assignment creation actions
        setCreatingAssignment: (state, action: PayloadAction<boolean>) => {
            state.isCreatingAssignment = action.payload
        },
        
        setCreatedAssignmentId: (state, action: PayloadAction<string | null>) => {
            state.createdAssignmentId = action.payload
        },
        
        // Error handling
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        
        clearError: (state) => {
            state.error = null
        },
        
        // Reset entire state
        resetAssignmentState: () => initialState
    }
})

// ============================================================================
// EXPORTS
// ============================================================================

export const {
    updateFormField,
    resetForm,
    addEssay,
    updateEssay,
    deleteEssay,
    selectEssay,
    clearAllEssays,
    addAdditionalQuestion,
    updateAdditionalQuestion,
    removeAdditionalQuestion,
    clearAdditionalQuestions,
    setCreatingAssignment,
    setCreatedAssignmentId,
    setError,
    clearError,
    resetAssignmentState
} = assignmentManagementSlice.actions

export default assignmentManagementSlice.reducer
