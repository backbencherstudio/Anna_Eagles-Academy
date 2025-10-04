import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

// 
export const studentsQuestionApi = createApi({
    reducerPath: 'studentsQuestionApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['StudentsQuestion'],
    endpoints: (builder) => ({

        // get all students question
        getStudentsQuestion: builder.query({
            query: ({ page, limit, search, filter }: { page: number; limit: number; search: string; filter: string }) => ({
                url: '/api/admin/contact',
                method: 'GET',
                params: { page, limit, search, filter },
            }),
            providesTags: ['StudentsQuestion'],
        }),


        // get single students question
        getSingleStudentsQuestion: builder.query({
            query: (id: string) => ({
                url: `/api/admin/contact/${id}`,
                method: 'GET',
            }),
            providesTags: ['StudentsQuestion'],
        }),

        // update student question status
        updateStudentQuestionStatus: builder.mutation({
            query: ({ id, status }: { id: string; status: string }) => ({
                url: `/api/admin/contact/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['StudentsQuestion'],
        }),

        // delete students question
        deleteStudentsQuestion: builder.mutation({
            query: (id: string) => ({
                url: `/api/admin/contact/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['StudentsQuestion'],
        }),
    }),
});

export const { 
    useGetStudentsQuestionQuery, 
    useGetSingleStudentsQuestionQuery, 
    useUpdateStudentQuestionStatusMutation, 
    useDeleteStudentsQuestionMutation 
} = studentsQuestionApi;
