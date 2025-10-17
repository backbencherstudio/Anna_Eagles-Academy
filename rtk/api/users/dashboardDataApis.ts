import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';


// get all data for dashboard
export const dashboardDataApi = createApi({
    reducerPath: 'dashboardDataApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['Dashboard'],
    endpoints: (builder) => ({
        // get all data for dashboard
        getDashboardData: builder.query({
            query: () => ({
                url: '/api/student/dashboard',
                method: 'GET',
            }),
            providesTags: ['Dashboard'],
            keepUnusedDataFor: 0,
        }),
    }),
});

export const { useGetDashboardDataQuery } = dashboardDataApi;