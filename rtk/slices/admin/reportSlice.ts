import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { reportApi, paymentOverviewApi, enrollmentDataApi } from '@/rtk/api/admin/reportApis'

type WebsiteUsage = {
  daily_users: number
  weekly_users: number
  monthly_users: number
  total_visitors: number
}

type ReportState = {
  websiteUsage: WebsiteUsage | null
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
  enrollmentData: {
    items: any[]
    pagination: any
  } | null
}

const initialState: ReportState = {
  websiteUsage: null,
  paymentOverview: null,
  enrollmentData: null,
}

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      reportApi.endpoints.getWebsiteTraffic.matchFulfilled,
      (state, action: PayloadAction<{ success: boolean; message: string; data: WebsiteUsage }>) => {
        state.websiteUsage = action.payload?.data ?? null
      }
    )
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
