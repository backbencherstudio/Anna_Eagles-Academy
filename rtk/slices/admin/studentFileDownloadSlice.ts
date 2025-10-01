import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface StudentFileDownloadQueryState {
  section_type: string
  search: string
  page: number
  limit: number
  series_id: string
  course_id: string
}

const initialState: StudentFileDownloadQueryState = {
  section_type: '',
  search: '',
  page: 1,
  limit: 10,
  series_id: '',
  course_id: '',
}

const studentFileDownloadSlice = createSlice({
  name: 'studentFileDownload',
  initialState,
  reducers: {
    setSectionType(state, action: PayloadAction<string>) {
      state.section_type = action.payload
      state.page = 1
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
      state.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload
      state.page = 1
    },
    setSeriesId(state, action: PayloadAction<string>) {
      state.series_id = action.payload
      state.page = 1
      state.course_id = ''
    },
    setCourseId(state, action: PayloadAction<string>) {
      state.course_id = action.payload
      state.page = 1
    },
    resetStudentFileDownloadQuery() {
      return initialState
    }
  }
})

export const { setSectionType, setSearch, setPage, setLimit, setSeriesId, setCourseId, resetStudentFileDownloadQuery } = studentFileDownloadSlice.actions
export default studentFileDownloadSlice.reducer
