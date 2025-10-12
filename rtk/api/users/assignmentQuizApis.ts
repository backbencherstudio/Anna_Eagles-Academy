import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';
import { PaginationParams, DEFAULT_PAGINATION } from '@/lib/paginationTypes';

// Assignment APIs
export const assignmentApi = createApi({
    reducerPath: 'assignmentQuizApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['Assignment'],
    endpoints: (builder) => ({

        // ****************assignment data get all assignment data ****************

        // Get all assignments params /api/student/assignment?submission_status=&page&limit
        getAllAssignments: builder.query({
            query: ({ submission_status = '', page = DEFAULT_PAGINATION.page, limit = DEFAULT_PAGINATION.limit }) => ({
                url: '/api/student/assignment',
                method: 'GET',
                params: { submission_status, page, limit },
            }),
            providesTags: ['Assignment'],
        }),

        // Get single assignment 
        getSingleAssignment: builder.query({
            query: (assignment_id: string) => ({
                url: `/api/student/assignment/${assignment_id}`,
                method: 'GET',
            }),
            providesTags: ['Assignment'],
        }),

        // Submit assignment 
        submitAssignment: builder.mutation({
            query: (assignment_id: string) => ({
                url: `/api/student/assignment/${assignment_id}/submit`,
                method: 'POST',
            }),
        }),


        // ****************quiz data get all quiz data ****************

        // get all quizzes /api/student/assignment?submission_status=&page&limit
        getAllQuizzes: builder.query({
            query: ({ submission_status = '', page = DEFAULT_PAGINATION.page, limit = DEFAULT_PAGINATION.limit }) => ({
                url: '/api/student/quiz',
                method: 'GET',
                params: { submission_status, page, limit },
            }),
            providesTags: ['Assignment'],
        }),

        // get single quiz 
        getSingleQuiz: builder.query({
            query: (quiz_id: string) => ({
                url: `/api/student/quiz/${quiz_id}`,
                method: 'GET',
            }),
            providesTags: ['Assignment'],
        }),

        // submit quiz 
        submitQuiz: builder.mutation({
            query: (quiz_id: string) => ({
                url: `/api/student/quiz/${quiz_id}/submit`,
                method: 'POST',
            }),
        }),

        // 
    }),
});

export const {
    useGetAllAssignmentsQuery,
    useGetAllQuizzesQuery,
    useGetSingleAssignmentQuery,
    useGetSingleQuizQuery,
    useSubmitAssignmentMutation,
    useSubmitQuizMutation
} = assignmentApi;