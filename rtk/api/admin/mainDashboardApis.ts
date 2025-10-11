import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

// get all data for main dashboard

export const mainDashboardApi = createApi({
    reducerPath: 'mainDashboardApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['MainDashboard'],
    endpoints: (builder) => ({
        // get all data for main dashboard params e pass date and period
        getAllDataForMainDashboard: builder.query({
            query: ({ date, period }: { date?: string; period: string }) => ({
                url: '/api/admin/dashboard',
                method: 'GET',
                params: { ...(date && { date }), period },
            }),
            providesTags: ['MainDashboard'],
        }),
    }),
});

export const { useGetAllDataForMainDashboardQuery } = mainDashboardApi;
