import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';


// get all student schedule
export const scheduleApi = createApi({
    reducerPath: 'scheduleApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['Schedule'],
    endpoints: (builder) => ({

        // get all student schedule
        getAllStudentSchedule: builder.query({
            query: ({ date = '' }: { date?: string }) => ({
                url: '/api/student/schedule-event',
                method: 'GET',
                params: { date },
            }),
            providesTags: ['Schedule'],
            keepUnusedDataFor: 0,
        }),

        // get single student schedule
        getSingleStudentSchedule: builder.query({
            query: (id: string) => ({
                url: `/api/student/schedule-event/${id}`,
                method: 'GET',
            }),
            providesTags: ['Schedule'],
            keepUnusedDataFor: 0,
        }),
    }),
});
export const { useGetAllStudentScheduleQuery, useGetSingleStudentScheduleQuery } = scheduleApi;