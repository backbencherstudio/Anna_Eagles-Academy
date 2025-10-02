import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Student {
    id: string
    name: string
    email: string
}

interface GiftCardGenerateState {
    selectedStudent: Student | null
    studentEmail: string
    recipientName: string
    senderName: string
    cardTitle: string
    message: string
    selectedImage: number
    isLoading: boolean
    error: string | null
    isSuccess: boolean
}

const initialState: GiftCardGenerateState = {
    selectedStudent: null,
    studentEmail: '',
    recipientName: '',
    senderName: '',
    cardTitle: 'Holiday Greetings',
    message: 'Wishing you and your family a joyous holiday season filled with peace, love and happiness.',
    selectedImage: 2, // Default to style 2
    isLoading: false,
    error: null,
    isSuccess: false
}

const giftCardGenerateSlice = createSlice({
    name: 'giftCardGenerate',
    initialState,
    reducers: {
        setSelectedStudent: (state, action: PayloadAction<Student>) => {
            state.selectedStudent = action.payload
            state.studentEmail = action.payload.email
            state.recipientName = action.payload.name
        },
        setStudentEmail: (state, action: PayloadAction<string>) => {
            state.studentEmail = action.payload
        },
        setRecipientName: (state, action: PayloadAction<string>) => {
            state.recipientName = action.payload
        },
        setSenderName: (state, action: PayloadAction<string>) => {
            state.senderName = action.payload
        },
        setCardTitle: (state, action: PayloadAction<string>) => {
            state.cardTitle = action.payload
        },
        setMessage: (state, action: PayloadAction<string>) => {
            state.message = action.payload
        },
        setSelectedImage: (state, action: PayloadAction<number>) => {
            state.selectedImage = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        setSuccess: (state, action: PayloadAction<boolean>) => {
            state.isSuccess = action.payload
        },
        resetForm: (state) => {
            state.selectedStudent = null
            state.studentEmail = ''
            state.recipientName = ''
            state.senderName = ''
            state.cardTitle = 'Holiday Greetings'
            state.message = 'Wishing you and your family a joyous holiday season filled with peace, love and happiness.'
            state.selectedImage = 2
            state.error = null
        },
        clearSuccess: (state) => {
            state.isSuccess = false
        }
    }
})

export const {
    setSelectedStudent,
    setStudentEmail,
    setRecipientName,
    setSenderName,
    setCardTitle,
    setMessage,
    setSelectedImage,
    setLoading,
    setError,
    setSuccess,
    resetForm,
    clearSuccess
} = giftCardGenerateSlice.actions

export default giftCardGenerateSlice.reducer
