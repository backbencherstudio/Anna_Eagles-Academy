import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

// payments
export const paymentsApi = createApi({
    reducerPath: 'paymentsApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['Payments'],
    endpoints: (builder) => ({

        // checkout 
        checkout: builder.mutation({
            query: (payment: { series_id: string }) => ({
                url: '/api/student/checkout',
                method: 'POST',
                body: payment,
            }),
            invalidatesTags: ['Payments'],
        }),

        // get checkout checkout_id
        getCheckout: builder.query({
            query: (checkout_id: string) => ({
                url: `/api/student/checkout/${checkout_id}`,
                method: 'GET',
                params: { checkout_id },
            }),
            providesTags: ['Payments'],
        }),

        // apply coupon 
        applyCoupon: builder.mutation({
            query: (coupon: { checkout_id: string, code: string }) => ({
                url: '/api/student/checkout/apply-code',
                method: 'POST',
                body: coupon,
            }),
            invalidatesTags: ['Payments'],
        }),


        // pay now 
        payNow: builder.mutation({
            query: (checkout_id: string) => ({
                url: '/api/student/enrollment',
                method: 'POST',
                body: { checkout_id },
            }),
            invalidatesTags: ['Payments'],
        }),



    }),
});

export const { useCheckoutMutation, useGetCheckoutQuery, useApplyCouponMutation, usePayNowMutation } = paymentsApi;


