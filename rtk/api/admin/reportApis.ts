import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

// website-traffic APIs
export const reportApi = createApi({
    reducerPath: 'reportApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['Report'],
    endpoints: (builder) => ({

        // get website traffic params pass period and date
        getWebsiteTraffic: builder.query({
            query: ({ period }: { period: string }) => ({
                url: '/api/admin/report/website-traffic',
                method: 'GET',
                params: { period },
            }),
            providesTags: ['Report'],
        }),

    }),

});

export const { useGetWebsiteTrafficQuery } = reportApi;

// series-progress api 
export const seriesProgressApi = createApi({
    reducerPath: 'seriesProgressApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['SeriesProgress'],
    endpoints: (builder) => ({
        // get series progress BODY TE SERIES_ID PASS KORTE HOB  /api/admin/report/payment-overview?series_id=cmfwdjfc00002ws3wb8lwcq9a
        getSeriesProgress: builder.query({
            query: (params?: Record<string, any>) => ({
                url: '/api/admin/report/series-progress',
                method: 'GET',
                params,
            }),
            providesTags: ['SeriesProgress'],
        }),

    }),
});

export const { useGetSeriesProgressQuery } = seriesProgressApi;

// payment-overview api
export const paymentOverviewApi = createApi({
    reducerPath: 'paymentOverviewApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['PaymentOverview'],
    endpoints: (builder) => ({
        // get payment 
        getPaymentOverview: builder.query({
            query: (params?: Record<string, any>) => ({
                url: '/api/admin/report/payment-overview',
                method: 'GET',
                params,
            }),
            providesTags: ['PaymentOverview'],
        }),

    }),
});

export const { useGetPaymentOverviewQuery } = paymentOverviewApi;


// enrollment data api
export const enrollmentDataApi = createApi({
    reducerPath: 'enrollmentDataApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['EnrollmentData'],
    endpoints: (builder) => ({


        // get enrollment data
        getEnrollmentData: builder.query({
            query: (params?: Record<string, any>) => ({
                url: '/api/admin/report/enrollments',
                method: 'GET',
                params,
            }),
            providesTags: ['EnrollmentData'],
        }),
    }),
});

export const { useGetEnrollmentDataQuery } = enrollmentDataApi;