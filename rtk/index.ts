import { configureStore } from '@reduxjs/toolkit'
import audioReducer from '@/rtk/slices/audioSlice'
import authReducer from '@/rtk/slices/authSlice'
import courseManagementReducer from '@/rtk/slices/admin/courseManagementSlice'
import managementCourseReducer from '@/rtk/slices/admin/managementCourseSlice'
import assignmentManagementReducer from '@/rtk/slices/admin/assignmentManagementSlice'
import { authApi } from '@/rtk/api/authApi'
import { managementCourseApi } from './api/admin/managementCourseApis'
import { manageMaterialsApi } from './api/admin/manageMaterialsApis'
import { courseFilterApi } from './api/admin/courseFilterApis'
import { quizApi } from './api/admin/quizApis'
import { assignmentApi } from './api/admin/assignmentApis'
import assignmentEvaluationReducer from '@/rtk/slices/admin/assignmentEvaluationSlice'
import assignmentEssayEvaluationReducer from '@/rtk/slices/admin/assignmentEssayEvaluationSlice'
import assignmentQuizEvaluationReducer from '@/rtk/slices/admin/assignmentQuizEvaluationSlice'
import { assignmentEvaluationApi } from '@/rtk/api/admin/assignmentEvaluationApis'
import studentFileDownloadReducer from '@/rtk/slices/admin/studentFileDownloadSlice'
import { studentFileDownloadApi } from './api/admin/studentFileDownloadApis'
import teacherSectionReducer from '@/rtk/slices/admin/teacherSectionSlice'
import { teacherSectionApi } from './api/admin/teacherSectionApis'
import studentFeedbackReducer from '@/rtk/slices/admin/studentFeedbackslice'
import { studentFeedbackApi } from '@/rtk/api/admin/studentFeedbackApis'
import { filterStudentListApi } from '@/rtk/api/admin/filterStudentListApis'
import { scholarshipCodeGenerateApi } from '@/rtk/api/admin/scholarshipCodeGenerateApis'
import scholarshipCodeGenerateReducer from '@/rtk/slices/admin/scholarshipCodeGenerateSlice'
import { giftCardGenerateApi } from '@/rtk/api/admin/giftCardGenerateApis'
import giftCardGenerateReducer from '@/rtk/slices/admin/giftCardGenerateSlice'
import uploadProgressReducer from '@/rtk/slices/uploadProgressSlice'

import studentsQuestionReducer from '@/rtk/slices/admin/studentsQuestionSlice'
import { studentsQuestionApi } from './api/admin/studentsQuestionApis'


export const store = configureStore({
  reducer: {
    audio: audioReducer,
    auth: authReducer,

    // admin
    courseManagement: courseManagementReducer,
    managementCourse: managementCourseReducer,
    assignmentManagement: assignmentManagementReducer,
    assignmentEvaluation: assignmentEvaluationReducer,
    assignmentEssayEvaluation: assignmentEssayEvaluationReducer,
    assignmentQuizEvaluation: assignmentQuizEvaluationReducer,
    studentFileDownload: studentFileDownloadReducer,
    teacherSection: teacherSectionReducer,
    studentFeedback: studentFeedbackReducer,
    uploadProgress: uploadProgressReducer,
    [authApi.reducerPath]: authApi.reducer,
    [managementCourseApi.reducerPath]: managementCourseApi.reducer,
    [manageMaterialsApi.reducerPath]: manageMaterialsApi.reducer,
    [courseFilterApi.reducerPath]: courseFilterApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    [assignmentApi.reducerPath]: assignmentApi.reducer,
    [assignmentEvaluationApi.reducerPath]: assignmentEvaluationApi.reducer,
    [studentFileDownloadApi.reducerPath]: studentFileDownloadApi.reducer,
    [teacherSectionApi.reducerPath]: teacherSectionApi.reducer,
    [studentFeedbackApi.reducerPath]: studentFeedbackApi.reducer,
    [filterStudentListApi.reducerPath]: filterStudentListApi.reducer,
    [scholarshipCodeGenerateApi.reducerPath]: scholarshipCodeGenerateApi.reducer,
    scholarshipCodeGenerate: scholarshipCodeGenerateReducer,
    [giftCardGenerateApi.reducerPath]: giftCardGenerateApi.reducer,
    giftCardGenerate: giftCardGenerateReducer,
    studentsQuestion: studentsQuestionReducer,
    [studentsQuestionApi.reducerPath]: studentsQuestionApi.reducer,
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
      studentFileDownloadApi.middleware,
      teacherSectionApi.middleware,
      studentFeedbackApi.middleware,
      filterStudentListApi.middleware,
      scholarshipCodeGenerateApi.middleware,
      giftCardGenerateApi.middleware,
      studentsQuestionApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
