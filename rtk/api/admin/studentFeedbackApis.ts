import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

// get all
export const studentFeedbackApi = createApi({
    reducerPath: 'studentFeedbackApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['StudentFeedback'],
    endpoints: (builder) => ({


        // get all 
        getAllStudentFeedback: builder.query({
            query: ({ page = 1, limit = 10, search = '', type = '' }) => ({
                url: '/api/admin/feedback',
                method: 'GET',
                params: { page, limit, search, type },
            }),
            providesTags: ['StudentFeedback'],
        }),

        // get single
        getSingleStudentFeedback: builder.query({
            query: (id: string) => ({
                url: `/api/admin/feedback/${id}`,
                method: 'GET',
            }),
            providesTags: ['StudentFeedback'],
        }),

        // approve
        approveStudentFeedback: builder.mutation({
            query: (id: string) => ({
                url: `/api/admin/feedback/${id}/approve`,
                method: 'PATCH',
            }),
            invalidatesTags: ['StudentFeedback'],
        }),

        // reject
        RejectStudentFeedback: builder.mutation({
            query: (id: string) => ({
                url: `/api/admin/feedback/${id}/reject`,
                method: 'PATCH',
            }),
            invalidatesTags: ['StudentFeedback'],
        }),

        // delete
        deleteStudentFeedback: builder.mutation({
            query: (id: string) => ({
                url: `/api/admin/feedback/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['StudentFeedback'],
        }),
        

    }),
});

export const { useGetAllStudentFeedbackQuery, useGetSingleStudentFeedbackQuery, useApproveStudentFeedbackMutation, useRejectStudentFeedbackMutation, useDeleteStudentFeedbackMutation } = studentFeedbackApi;