import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

type UploadProgressState = {
  isVisible: boolean
  percent: number
  status: UploadStatus
  message?: string | null
  currentFileName: string | null
  abortRequested: boolean
  canCancel: boolean
}

const initialState: UploadProgressState = {
  isVisible: false,
  percent: 0,
  status: 'idle',
  message: null,
  currentFileName: null,
  abortRequested: false,
  canCancel: false,
}

const uploadProgressSlice = createSlice({
  name: 'uploadProgress',
  initialState,
  reducers: {
    startUpload(state, action: PayloadAction<{ canCancel?: boolean } | undefined>) {
      state.isVisible = true
      state.status = 'uploading'
      state.percent = 0
      state.message = null
      state.abortRequested = false
      state.canCancel = Boolean(action?.payload?.canCancel)
    },
    setUploadProgress(state, action: PayloadAction<number>) {
      state.isVisible = true
      state.status = 'uploading'
      state.percent = Math.max(0, Math.min(100, Math.round(action.payload)))
    },
    setCurrentFileName(state, action: PayloadAction<string | null>) {
      state.currentFileName = action.payload
    },
    requestAbort(state) {
      state.abortRequested = true
    },
    clearAbort(state) {
      state.abortRequested = false
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
      state.currentFileName = null
      state.abortRequested = false
      state.canCancel = false
    },
  },
})

export const { startUpload, setUploadProgress, setCurrentFileName, requestAbort, clearAbort, finishUpload, errorUpload, hideUpload } = uploadProgressSlice.actions
export default uploadProgressSlice.reducer


