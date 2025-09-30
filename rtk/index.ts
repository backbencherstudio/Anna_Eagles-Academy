import { configureStore } from '@reduxjs/toolkit'
import audioReducer from '@/rtk/slices/audioSlice'
import authReducer from '@/rtk/slices/authSlice'
import courseManagementReducer from '@/rtk/slices/courseManagementSlice'
import managementCourseReducer from '@/rtk/slices/managementCourseSlice'
import assignmentManagementReducer from '@/rtk/slices/assignmentManagementSlice'
import { authApi } from '@/rtk/api/authApi'
import { managementCourseApi } from './api/admin/managementCourseApis'
import { manageMaterialsApi } from './api/admin/manageMaterialsApis'
import { courseFilterApi } from './api/admin/courseFilterApis'
import { quizApi } from './api/admin/quizApis'
import { assignmentApi } from './api/admin/assignmentApis'
import assignmentEvaluationReducer from '@/rtk/slices/assignmentEvaluationSlice'
import assignmentEssayEvaluationReducer from '@/rtk/slices/assignmentEssayEvaluationSlice'
import assignmentQuizEvaluationReducer from '@/rtk/slices/assignmentQuizEvaluationSlice'
import { assignmentEvaluationApi } from '@/rtk/api/admin/assignmentEvaluationApis'

export const store = configureStore({
  reducer: {
    audio: audioReducer,
    auth: authReducer,
    courseManagement: courseManagementReducer,
    managementCourse: managementCourseReducer,
    assignmentManagement: assignmentManagementReducer,
    assignmentEvaluation: assignmentEvaluationReducer,
    assignmentEssayEvaluation: assignmentEssayEvaluationReducer,
    assignmentQuizEvaluation: assignmentQuizEvaluationReducer,
    [authApi.reducerPath]: authApi.reducer,
    [managementCourseApi.reducerPath]: managementCourseApi.reducer,
    [manageMaterialsApi.reducerPath]: manageMaterialsApi.reducer,
    [courseFilterApi.reducerPath]: courseFilterApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    [assignmentApi.reducerPath]: assignmentApi.reducer,
    [assignmentEvaluationApi.reducerPath]: assignmentEvaluationApi.reducer,
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
          'courseManagement.moduleLessons',
          'assignmentManagement.formData.submissionDeadline',
          'assignmentManagement.essays'
        ],
      },
    }).concat(
      authApi.middleware,
      managementCourseApi.middleware,
      manageMaterialsApi.middleware,
      courseFilterApi.middleware,
      quizApi.middleware,
      assignmentApi.middleware,
      assignmentEvaluationApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
