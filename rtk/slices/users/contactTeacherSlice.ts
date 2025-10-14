import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Types
export interface ContactTeacherForm {
  name: string
  email: string
  phone: string
  bestTime: string
  whatsapp: string
  reason: string
  message: string
}

export interface ContactTeacherState {
  form: ContactTeacherForm
  isSubmitting: boolean
  submitted: boolean
  error: string | null
}

export interface UserDataPayload {
  name: string
  email: string
  phone?: string
}

// Initial state
const initialState: ContactTeacherState = {
  form: {
    name: '',
    email: '',
    phone: '',
    bestTime: '',
    whatsapp: '',
    reason: 'Class Schedule',
    message: '',
  },
  isSubmitting: false,
  submitted: false,
  error: null,
}

const contactTeacherSlice = createSlice({
  name: 'contactTeacher',
  initialState,
  reducers: {
    updateFormField: (state, action: PayloadAction<{ field: keyof ContactTeacherForm; value: string }>) => {
      state.form[action.payload.field] = action.payload.value
      state.error = null
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload
    },
    setSubmitted: (state, action: PayloadAction<boolean>) => {
      state.submitted = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    resetForm: (state) => {
      state.form = initialState.form
      state.submitted = false
      state.error = null
    },
    populateWithUserData: (state, action: PayloadAction<UserDataPayload>) => {
      state.form.name = action.payload.name
      state.form.email = action.payload.email
      if (action.payload.phone) {
        state.form.phone = action.payload.phone
      }
    },
  },
})

export const { updateFormField, setSubmitting, setSubmitted, setError, resetForm, populateWithUserData } = contactTeacherSlice.actions
export default contactTeacherSlice.reducer