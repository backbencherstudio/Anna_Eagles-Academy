import { createSlice } from '@reduxjs/toolkit'
import { eventsApi } from '@/rtk/api/admin/enventsApis'

interface EventsState {
    creating: boolean
    error: string | null
    lastCreated: any | null
}

const initialState: EventsState = {
    creating: false,
    error: null,
    lastCreated: null,
}

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(eventsApi.endpoints.addEvent.matchPending, (state) => {
                state.creating = true
                state.error = null
            })
            .addMatcher(eventsApi.endpoints.addEvent.matchFulfilled, (state, action) => {
                state.creating = false
                state.error = null
                state.lastCreated = action.payload
            })
            .addMatcher(eventsApi.endpoints.addEvent.matchRejected, (state, action) => {
                state.creating = false
                state.error = (action.error?.message as string) || 'Failed to create event'
            })
    }
})

export default eventsSlice.reducer
