import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TeacherSectionData {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  section_type: string
  title: string
  description: string | null
  duration: string | null
  release_date: string | null
  is_released: boolean
  position: number
  status: string
  view_count: number
  file_url: string | null
  release_status: string
  scheduled_release_at: string | null
}

interface TeacherSectionState {
  isLoading: boolean
  error: string | null
  success: boolean
  message: string | null
  
  // Table data
  data: TeacherSectionData[]
  totalCount: number
  currentPage: number
  totalPages: number
  
  // Single item data
  selectedItem: TeacherSectionData | null
  
  // Search and filters
  searchQuery: string
  selectedType: string
  
  // Pagination
  limit: number
}

const initialState: TeacherSectionState = {
  isLoading: false,
  error: null,
  success: false,
  message: null,
  
  // Table data
  data: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 0,
  
  // Single item data
  selectedItem: null,
  
  // Search and filters
  searchQuery: '',
  selectedType: '',
  
  // Pagination
  limit: 10,
}

const teacherSectionSlice = createSlice({
  name: 'teacherSection',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    setSuccess: (state, action: PayloadAction<{ success: boolean; message: string | null }>) => {
      state.success = action.payload.success
      state.message = action.payload.message
      state.isLoading = false
      state.error = null
    },
    clearState: (state) => {
      state.isLoading = false
      state.error = null
      state.success = false
      state.message = null
    },
    
    // Table data actions
    setTableData: (state, action: PayloadAction<{
      data: TeacherSectionData[]
      totalCount: number
      currentPage: number
      totalPages: number
    }>) => {
      state.data = action.payload.data
      state.totalCount = action.payload.totalCount
      state.currentPage = action.payload.currentPage
      state.totalPages = action.payload.totalPages
    },
    
    // Search and filter actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.currentPage = 1 
    },
    setSelectedType: (state, action: PayloadAction<string>) => {
      state.selectedType = action.payload
      state.currentPage = 1 
    },
    
    // Pagination actions
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
      state.currentPage = 1 
    },
    
    // Single item actions
    setSelectedItem: (state, action: PayloadAction<TeacherSectionData | null>) => {
      state.selectedItem = action.payload
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null
    },
  },
})

export const { 
  setLoading, 
  setError, 
  setSuccess, 
  clearState,
  setTableData,
  setSearchQuery,
  setSelectedType,
  setCurrentPage,
  setLimit,
  setSelectedItem,
  clearSelectedItem
} = teacherSectionSlice.actions

export type { TeacherSectionData }
export default teacherSectionSlice.reducer