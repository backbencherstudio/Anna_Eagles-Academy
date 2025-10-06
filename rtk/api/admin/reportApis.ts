import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

// website-traffic APIs
export const reportApi = createApi({
    reducerPath: 'reportApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['Report'],
    endpoints: (builder) => ({

        // get website traffic
        getWebsiteTraffic: builder.query({
            query: () => ({
                url: '/api/admin/report/website-traffic',
                method: 'GET',
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
        // get series progress
        getSeriesProgress: builder.query({
            query: () => ({
                url: '/api/admin/report/series-progress',
                method: 'GET',
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
        // get payment overview
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