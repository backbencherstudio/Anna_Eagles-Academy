import { configureStore } from '@reduxjs/toolkit'
import audioReducer from '@/redux/slices/audioSlice'
import authReducer from '@/redux/slices/authSlice'
import courseManagementReducer from '@/redux/slices/courseManagementSlice'
import managementCourseReducer from '@/redux/slices/managementCourseSlice'
import { authApi } from '@/redux/api/authApi'
import { managementCourseApi } from './api/managementCourseApis'

export const store = configureStore({
  reducer: {
    audio: audioReducer,
    auth: authReducer,
    courseManagement: courseManagementReducer,
    managementCourse: managementCourseReducer,
    [authApi.reducerPath]: authApi.reducer,
    [managementCourseApi.reducerPath]: managementCourseApi.reducer,
  },


  // middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore File objects and other non-serializable values in specific paths
        ignoredActions: [
          'courseManagement/updateCourseField',
          'courseManagement/addModule',
          'courseManagement/updateModuleField',
          'courseManagement/updateModuleIntroVideo',
          'courseManagement/updateModuleEndVideo',
          'courseManagement/updateModuleLessons',
          'courseManagement/createCourseAsync/pending',
          'courseManagement/createCourseAsync/fulfilled',
          'courseManagement/createCourseAsync/rejected'
        ],
        ignoredActionsPaths: ['payload.value', 'payload.file', 'payload.lessons'],
        ignoredPaths: [
          'courseManagement.courseForm.thumbnail',
          'courseManagement.courseForm.courses',
          'courseManagement.courseForm.dateRange',
          'courseManagement.moduleIntroVideos',
          'courseManagement.moduleEndVideos',
          'courseManagement.moduleLessons'
        ],
      },
    }).concat(authApi.middleware, managementCourseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
