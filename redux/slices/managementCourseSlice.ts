import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type SeriesBasic = {
  id: string
  title: string
  description: string
  note?: string | null
  available_site: number
  course_type: string
  thumbnail: string | null
}

type ManagementCourseState = {
  currentSeriesId: string | null
  currentSeries: SeriesBasic | null
  moduleUiIdToBackendId: Record<string, string>
}

const initialState: ManagementCourseState = {
  currentSeriesId: null,
  currentSeries: null,
  moduleUiIdToBackendId: {},
}

const managementCourseSlice = createSlice({
  name: 'managementCourse',
  initialState,
  reducers: {
    setCurrentSeriesId(state, action: PayloadAction<string | null>) {
      state.currentSeriesId = action.payload
    },
    setCurrentSeries(state, action: PayloadAction<SeriesBasic | null>) {
      state.currentSeries = action.payload
    },
    clearCurrentSeries(state) {
      state.currentSeriesId = null
      state.currentSeries = null
    },
    setModuleMapping(state, action: PayloadAction<{ uiId: string; backendId: string }>) {
      state.moduleUiIdToBackendId[action.payload.uiId] = action.payload.backendId
    },
    clearModuleMapping(state, action: PayloadAction<{ uiId: string }>) {
      delete state.moduleUiIdToBackendId[action.payload.uiId]
    },
  },
})

export const { setCurrentSeriesId, setCurrentSeries, clearCurrentSeries, setModuleMapping, clearModuleMapping } = managementCourseSlice.actions
export default managementCourseSlice.reducer


