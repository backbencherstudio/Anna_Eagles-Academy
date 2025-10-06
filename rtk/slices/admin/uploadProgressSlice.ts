import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

type UploadProgressState = {
  isVisible: boolean
  percent: number
  status: UploadStatus
  message?: string | null
}

const initialState: UploadProgressState = {
  isVisible: false,
  percent: 0,
  status: 'idle',
  message: null,
}

const uploadProgressSlice = createSlice({
  name: 'uploadProgress',
  initialState,
  reducers: {
    startUpload(state) {
      state.isVisible = true
      state.status = 'uploading'
      state.percent = 0
      state.message = null
    },
    setUploadProgress(state, action: PayloadAction<number>) {
      state.isVisible = true
      state.status = 'uploading'
      state.percent = Math.max(0, Math.min(100, Math.round(action.payload)))
    },
    finishUpload(state) {
      state.status = 'success'
      state.percent = 100
    },
    errorUpload(state, action: PayloadAction<string | undefined>) {
      state.status = 'error'
      state.message = action.payload || null
    },
    hideUpload(state) {
      state.isVisible = false
      state.status = 'idle'
      state.percent = 0
      state.message = null
    },
  },
})

export const { startUpload, setUploadProgress, finishUpload, errorUpload, hideUpload } = uploadProgressSlice.actions
export default uploadProgressSlice.reducer


