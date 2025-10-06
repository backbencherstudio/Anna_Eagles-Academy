import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { reportApi, seriesProgressApi, paymentOverviewApi, enrollmentDataApi } from '@/rtk/api/admin/reportApis'

// Website usage/traffic summary used in analytics widgets
type WebsiteUsage = {
  daily_users: number
  weekly_users: number
  monthly_users: number
  total_visitors: number
}

// Central admin report state powering dashboard/report pages
type ReportState = {
  // Website traffic widget data
  websiteUsage: WebsiteUsage | null
  // Series progress data for CompletionStatusPieChart and CourseCompletionRatesChart
  seriesProgress: {
    completion_status_distribution: {
      total_enrollments: number
      completed: { count: number; percentage: number }
      in_progress: { count: number; percentage: number }
    } | null
    series_completion_rates: {
      overall_completion_rate: number
      series: Array<{
        series_id: string
        title: string
        total_enrollments: number
        completed_enrollments: number
        completion_rate: number
        courses: Array<{
          course_id: string
          course_title: string
          position: number
          total_lesson_files: number
          total_progress_records: number
          completed_courses: number
          in_progress_courses: number
          pending_courses: number
          average_completion_percentage: number
          course_completion_rate: number
        }>
        course_summary: {
          total_courses: number
          total_lesson_files: number
          total_course_progress_records: number
          overall_course_completion_rate: number
        }
      }>
    } | null
    series_details: Array<{
      series_id: string
      series_name: string
      start_date: string | null
      completion_date: string | null
      enrolled: number
      completed: number
      in_progress: number
      completion_rate: number
    }> | null
  }
  // Payment overview widgets and tables
  paymentOverview: {
    totals: {
      total_students: number
      fully_paid: number
      sponsored: number
      free_enrolled: number
      total_revenue: number
    }
    overview: Array<{ label: string; count: number; percentage: number }>
    fully_paid: { items: any[]; pagination: any }
    sponsored: { items: any[]; pagination: any }
    free_enrolled: { items: any[]; pagination: any }
  } | null
  // Enrollment list table
  enrollmentData: {
    items: any[]
    pagination: any
  } | null
}

// Default initial state for all report widgets
const initialState: ReportState = {
  websiteUsage: null,
  seriesProgress: {
    completion_status_distribution: null,
    series_completion_rates: null,
    series_details: null,
  },
  paymentOverview: null,
  enrollmentData: null,
}

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Website traffic → maps API payload into websiteUsage
    builder.addMatcher(
      reportApi.endpoints.getWebsiteTraffic.matchFulfilled,
      (state, action: PayloadAction<{ success: boolean; message: string; data: WebsiteUsage }>) => {
        state.websiteUsage = action.payload?.data ?? null
      }
    )
    // Series progress → feeds CompletionStatusPieChart and CourseCompletionRatesChart
    builder.addMatcher(
      seriesProgressApi.endpoints.getSeriesProgress.matchFulfilled,
      (
        state,
        action: PayloadAction<{
          success: boolean
          message: string
          data: ReportState['seriesProgress']
        }>
      ) => {
        const apiData = action.payload?.data
        state.seriesProgress.completion_status_distribution = apiData?.completion_status_distribution ?? null
        state.seriesProgress.series_completion_rates = apiData?.series_completion_rates ?? null
        // store series_details for table rendering (optional in some responses)
        state.seriesProgress.series_details = (apiData as any)?.series_details ?? null
      }
    )
    // Payment overview → totals, overview stats, and tables
    builder.addMatcher(
      paymentOverviewApi.endpoints.getPaymentOverview.matchFulfilled,
      (
        state,
        action: PayloadAction<{
          success: boolean
          message: string
          data: ReportState['paymentOverview']
        }>
      ) => {
        state.paymentOverview = action.payload?.data ?? null
      }
    )
    // Enrollment list → items and pagination
    builder.addMatcher(
      enrollmentDataApi.endpoints.getEnrollmentData.matchFulfilled,
      (
        state,
        action: PayloadAction<{
          success: boolean
          message: string
          data: any
        }>
      ) => {
        const apiData = action.payload?.data
        if (apiData) {
          state.enrollmentData = {
            items: apiData.enrollments ?? [],
            pagination: apiData.pagination ?? null,
          }
        } else {
          state.enrollmentData = null
        }
      }
    )
  },
})

export default reportSlice.reducer
