import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type StudentFileState = {
  creating: boolean
  lastMessage?: string
  error?: string
  sectionType: 'weekly-video-diary' | 'other-document'
}

const initialState: StudentFileState = {
  creating: false,
  sectionType: 'weekly-video-diary',
}

const studentFileSlice = createSlice({
  name: 'studentFile',
  initialState,
  reducers: {
    createStart(state) {
      state.creating = true
      state.error = undefined
      state.lastMessage = undefined
    },
    createSuccess(state, action: PayloadAction<string | undefined>) {
      state.creating = false
      state.lastMessage = action.payload
    },
    createFailure(state, action: PayloadAction<string | undefined>) {
      state.creating = false
      state.error = action.payload
    },
    setSectionType(state, action: PayloadAction<'weekly-video-diary' | 'other-document'>) {
      state.sectionType = action.payload
    },
    reset(state) {
      state.creating = false
      state.error = undefined
      state.lastMessage = undefined
    }
  }
})

export const { createStart, createSuccess, createFailure, reset, setSectionType } = studentFileSlice.actions
export default studentFileSlice.reducer


