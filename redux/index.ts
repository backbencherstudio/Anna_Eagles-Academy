import { configureStore } from '@reduxjs/toolkit'
import audioReducer from '@/redux/slices/audioSlice'
import authReducer from '@/redux/slices/authSlice'


export const store = configureStore({
  reducer: {
    audio: audioReducer,
    auth: authReducer,

  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
