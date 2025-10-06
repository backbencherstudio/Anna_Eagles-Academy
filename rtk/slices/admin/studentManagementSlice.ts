import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface StudentManagementState {
    search: string
    page: number
    limit: number
}

const initialState: StudentManagementState = {
    search: '',
    page: 1,
    limit: 10,
}

const studentManagementSlice = createSlice({
    name: 'studentManagement',
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload
            state.page = 1 // Reset to first page when searching
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        setLimit: (state, action: PayloadAction<number>) => {
            state.limit = action.payload
            state.page = 1 // Reset to first page when changing limit
        },
        resetFilters: (state) => {
            state.search = ''
            state.page = 1
            state.limit = 10
        },
    },
})

export const { setSearch, setPage, setLimit, resetFilters } = studentManagementSlice.actions
export default studentManagementSlice.reducer
