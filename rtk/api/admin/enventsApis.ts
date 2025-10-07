import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';
import { calendarSchedulesApi } from '@/rtk/api/admin/calendarSehedulesApis';

// add events
export const eventsApi = createApi({
    reducerPath: 'eventsApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['Events'],
    endpoints: (builder) => ({

        // add schedule event body te data pass korte hobe   
        addEvent: builder.mutation({
            query: (event) => ({
                url: '/api/admin/schedule-event',
                method: 'POST',
                body: event,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // ensure calendar schedules refetch
                    dispatch(calendarSchedulesApi.util.invalidateTags(['CalendarSchedules']))
                } catch {}
            },
        }),
    }),
});

// Auto-generated hooks
export const { useAddEventMutation } = eventsApi;