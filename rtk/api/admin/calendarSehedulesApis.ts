import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

// get all calendar schedules
export const calendarSchedulesApi = createApi({
    reducerPath: 'calendarSchedulesApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['CalendarSchedules'],
    endpoints: (builder) => ({

        // get all calendar schedules
        getAllCalendarSchedules: builder.query({
            query: ({ date = '' }: { date?: string }) => ({
                url: '/api/admin/schedule-event',
                method: 'GET',
                params: { date },
            }),
            providesTags: ['CalendarSchedules'],
        }),



        // get single calendar schedule
        getSingleCalendarSchedule: builder.query({
            query: (id: string) => ({
                url: `/api/admin/schedule-event/${id}`,
                method: 'GET',
            }),
            providesTags: ['CalendarSchedules'],
        }),

        // delete calendar schedule
        deleteCalendarSchedule: builder.mutation({
            query: (id: string) => ({
                url: `/api/admin/schedule-event/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CalendarSchedules'],
        }),
    }),
});
export const { useGetAllCalendarSchedulesQuery, useGetSingleCalendarScheduleQuery, useDeleteCalendarScheduleMutation } = calendarSchedulesApi;
