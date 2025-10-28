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
import { reportApi, seriesProgressApi, paymentOverviewApi, enrollmentDataApi   } from '@/rtk/api/admin/reportApis'
import reportReducer from '@/rtk/slices/admin/reportSlice'
import { quizApi } from './api/admin/quizApis'
import { assignmentApi as adminAssignmentApi } from './api/admin/assignmentApis'
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
import uploadProgressReducer from '@/rtk/slices/admin/uploadProgressSlice'
import eventsReducer from '@/rtk/slices/admin/eventsSlice'
import { eventsApi } from '@/rtk/api/admin/enventsApis'
import calendarSchedulesReducer from '@/rtk/slices/admin/calendarSehedulesSlice'
import { calendarSchedulesApi } from '@/rtk/api/admin/calendarSehedulesApis'
import { allCourseListApi } from '@/rtk/api/users/allCourseListApis'
import allCourseListReducer from '@/rtk/slices/users/allCourseListSlice'
import { paymentsApi } from '@/rtk/api/users/paymentsApis'
import paymentsReducer from '@/rtk/slices/users/paymentsSlice'
import { assignmentApi as assignmentQuizApi } from '@/rtk/api/users/assignmentQuizApis'
import assignmentQuizReducer from '@/rtk/slices/users/assignmentQuizSlice'
import { myCoursesApi } from '@/rtk/api/users/myCoursesApis'
import myCoursesReducer from '@/rtk/slices/users/myCoursesSlice'
import videoProgressReducer from '@/rtk/slices/users/videoProgressSlice'
import studentFileReducer from '@/rtk/slices/users/studentFileSlice'
import { studentFileApi } from '@/rtk/api/users/studentFileApis'
import studentDownloadMetrialsReducer from '@/rtk/slices/users/studentDownloadMetrialsSlice'
import { studentDownloadMaterialsApi } from '@/rtk/api/users/studentDownloadMetrialsApis'
import contactTeacherReducer from '@/rtk/slices/users/contactTeacherSlice'
import { contactTeacherApi } from '@/rtk/api/users/contactTeacherApis'
import { shareFeedBackApi } from '@/rtk/api/users/shareFeedBackApis'
import studentsQuestionReducer from '@/rtk/slices/admin/studentsQuestionSlice'
import { studentsQuestionApi } from './api/admin/studentsQuestionApis'
import studentManagementReducer from '@/rtk/slices/admin/studentManagementSlice'
import { studentManagementApi } from './api/admin/studentManagementApis'
import mainDashboardReducer from '@/rtk/slices/admin/mainDashboardSlice'
import { mainDashboardApi } from './api/admin/mainDashboardApis'
import { filterSeriesListApi } from './api/users/filterSeriesList'
import { scheduleApi } from './api/users/scheduleApis'
import { dashboardDataApi } from './api/users/dashboardDataApis'
import shareFeedbackReducer from '@/rtk/slices/users/shareFeedBackSlice'
import { getAllCompletedCourseCertificateApi, getSingleCompletedCourseCertificateApi, downloadAcademyDiplomaCertificateApi } from './api/users/diplomaCeritificateApis'
import diplomaCertificateReducer from '@/rtk/slices/users/diplomaCeritificateSlice'


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
    events: eventsReducer,
    calendarSchedules: calendarSchedulesReducer,
    report: reportReducer,
    [authApi.reducerPath]: authApi.reducer,
    [managementCourseApi.reducerPath]: managementCourseApi.reducer,
    [manageMaterialsApi.reducerPath]: manageMaterialsApi.reducer,
    [courseFilterApi.reducerPath]: courseFilterApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    [adminAssignmentApi.reducerPath]: adminAssignmentApi.reducer,
    [assignmentEvaluationApi.reducerPath]: assignmentEvaluationApi.reducer,
    [studentFileDownloadApi.reducerPath]: studentFileDownloadApi.reducer,
    [teacherSectionApi.reducerPath]: teacherSectionApi.reducer,
    [studentFeedbackApi.reducerPath]: studentFeedbackApi.reducer,
    [filterStudentListApi.reducerPath]: filterStudentListApi.reducer,
    [scholarshipCodeGenerateApi.reducerPath]: scholarshipCodeGenerateApi.reducer,
    scholarshipCodeGenerate: scholarshipCodeGenerateReducer,
    [giftCardGenerateApi.reducerPath]: giftCardGenerateApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [calendarSchedulesApi.reducerPath]: calendarSchedulesApi.reducer,
    giftCardGenerate: giftCardGenerateReducer,
    studentsQuestion: studentsQuestionReducer,
    [studentsQuestionApi.reducerPath]: studentsQuestionApi.reducer,
    studentManagement: studentManagementReducer,
    [studentManagementApi.reducerPath]: studentManagementApi.reducer,
    mainDashboard: mainDashboardReducer,
    [mainDashboardApi.reducerPath]: mainDashboardApi.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
    [seriesProgressApi.reducerPath]: seriesProgressApi.reducer,
    [paymentOverviewApi.reducerPath]: paymentOverviewApi.reducer,

    // user
    [enrollmentDataApi.reducerPath]: enrollmentDataApi.reducer,
    [allCourseListApi.reducerPath]: allCourseListApi.reducer,
    allCourseList: allCourseListReducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer,
    payments: paymentsReducer,
    [assignmentQuizApi.reducerPath]: assignmentQuizApi.reducer,
    assignmentQuiz: assignmentQuizReducer,
    [myCoursesApi.reducerPath]: myCoursesApi.reducer,
    myCourses: myCoursesReducer,
    videoProgress: videoProgressReducer,
    [filterSeriesListApi.reducerPath]: filterSeriesListApi.reducer,
    [studentFileApi.reducerPath]: studentFileApi.reducer,
    studentFile: studentFileReducer,
    // student download materials
    studentDownloadMetrials: studentDownloadMetrialsReducer,
    [studentDownloadMaterialsApi.reducerPath]: studentDownloadMaterialsApi.reducer,
  
    contactTeacher: contactTeacherReducer,
    [contactTeacherApi.reducerPath]: contactTeacherApi.reducer,
    [scheduleApi.reducerPath]: scheduleApi.reducer,
    [dashboardDataApi.reducerPath]: dashboardDataApi.reducer,
    [shareFeedBackApi.reducerPath]: shareFeedBackApi.reducer,
    shareFeedback: shareFeedbackReducer,
    [getAllCompletedCourseCertificateApi.reducerPath]: getAllCompletedCourseCertificateApi.reducer,
    [getSingleCompletedCourseCertificateApi.reducerPath]: getSingleCompletedCourseCertificateApi.reducer,
    [downloadAcademyDiplomaCertificateApi.reducerPath]: downloadAcademyDiplomaCertificateApi.reducer,
    diplomaCertificate: diplomaCertificateReducer,
    
    
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
        ignoredActionsPaths: ['payload.value', 'payload.file', 'payload.lessons', 'payload.onError'],
        ignoredPaths: [
          'courseManagement.courseForm.thumbnail',
          'courseManagement.courseForm.courses',
          'courseManagement.courseForm.dateRange',
          'courseManagement.moduleIntroVideos',
          'courseManagement.moduleEndVideos',
          'courseManagement.moduleLessons',
          'assignmentManagement.formData.submissionDeadline',
          'assignmentManagement.essays',
          'myCourses.currentVideoData.onError'
        ],
      },
    }).concat(
      authApi.middleware,
      managementCourseApi.middleware,
      manageMaterialsApi.middleware,
      courseFilterApi.middleware,
      quizApi.middleware,
      adminAssignmentApi.middleware,
      assignmentEvaluationApi.middleware,
      studentFileDownloadApi.middleware,
      teacherSectionApi.middleware,
      studentFeedbackApi.middleware,
      filterStudentListApi.middleware,
      scholarshipCodeGenerateApi.middleware,
      giftCardGenerateApi.middleware,
      studentsQuestionApi.middleware,
      studentManagementApi.middleware,
      mainDashboardApi.middleware,
      reportApi.middleware,
      seriesProgressApi.middleware,
      paymentOverviewApi.middleware,
      enrollmentDataApi.middleware,
      eventsApi.middleware,
      calendarSchedulesApi.middleware,
      // user
      allCourseListApi.middleware,
      paymentsApi.middleware,
      assignmentQuizApi.middleware,
      myCoursesApi.middleware,
      filterSeriesListApi.middleware,
      studentFileApi.middleware,
      studentDownloadMaterialsApi.middleware,
      contactTeacherApi.middleware,
      scheduleApi.middleware,
      dashboardDataApi.middleware,
      shareFeedBackApi.middleware,
      getAllCompletedCourseCertificateApi.middleware,
      getSingleCompletedCourseCertificateApi.middleware,
      downloadAcademyDiplomaCertificateApi.middleware,
    ),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
