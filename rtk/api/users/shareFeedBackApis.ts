import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/axisoClients';

// create share feedback
export const shareFeedBackApi = createApi({
    reducerPath: 'shareFeedBackApi',
    baseQuery: createBaseQuery(),
    tagTypes: ['ShareFeedBack'],
    endpoints: (builder) => ({
        // create feedback
        createFeedback: builder.mutation({
            query: (data: any) => ({
                url: '/api/student/feedback',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['ShareFeedBack'],
        }),

        // get all feedback
        getAllFeedback: builder.query({
            query: ({ page = 1, limit = 10, search = '', type = '' }) => ({
                url: '/api/student/feedback',
                method: 'GET',
                params: { page, limit, search, type },
            }),
            providesTags: ['ShareFeedBack'],
            keepUnusedDataFor: 0,
        }),
    }),
});

export const { useCreateFeedbackMutation, useGetAllFeedbackQuery } = shareFeedBackApi;