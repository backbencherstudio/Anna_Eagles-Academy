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
    
    // Pagination and search for card history (consolidated from cardGeneratorSlice)
    search: string
    page: number
    limit: number
}

export const GIFT_CARD_CONSTANTS = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
} as const

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
    isSuccess: false,
    
    // Pagination defaults (consolidated from cardGeneratorSlice)
    search: '',
    page: GIFT_CARD_CONSTANTS.DEFAULT_PAGE,
    limit: GIFT_CARD_CONSTANTS.DEFAULT_LIMIT,
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
        },
        
        // Pagination and search actions (consolidated from cardGeneratorSlice)
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        setLimit: (state, action: PayloadAction<number>) => {
            state.limit = action.payload
        },
        setPagination: (state, action: PayloadAction<{ page?: number; limit?: number }>) => {
            if (typeof action.payload.page === 'number') state.page = action.payload.page
            if (typeof action.payload.limit === 'number') state.limit = action.payload.limit
        },
        resetGiftCardState: () => {
            return initialState
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
    setLoading: setGiftCardLoading,
    setError: setGiftCardError,
    setSuccess: setGiftCardSuccess,
    resetForm,
    clearSuccess,
    // Pagination and search actions (consolidated from cardGeneratorSlice)
    setSearch,
    setPage,
    setLimit,
    setPagination,
    resetGiftCardState
} = giftCardGenerateSlice.actions

export default giftCardGenerateSlice.reducer
