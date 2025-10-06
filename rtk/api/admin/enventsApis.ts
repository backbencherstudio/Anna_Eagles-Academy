import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

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
        }),
    }),
});

// Auto-generated hooks
export const { useAddEventMutation } = eventsApi;