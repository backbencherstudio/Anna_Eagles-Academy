import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';
import { PaginationParams, DEFAULT_PAGINATION } from '@/lib/paginationTypes';

// Assignment APIs
export const assignmentApi = createApi({
    reducerPath: 'assignmentQuizApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['Assignment'],
    endpoints: (builder) => ({
        // Get all assignments params 
        getAllAssignments: builder.query({
            query: ({ page = DEFAULT_PAGINATION.page, limit = DEFAULT_PAGINATION.limit, search = DEFAULT_PAGINATION.search, type = DEFAULT_PAGINATION.type, submission_status }: PaginationParams & { submission_status?: string }) => ({
                url: '/api/student/assignment',
                method: 'GET',
                params: { page, limit, search, type, submission_status },
            }),
            providesTags: ['Assignment'],
            keepUnusedDataFor: 0,
        }),

        // Get single assignment 
        getSingleAssignment: builder.query({
            query: (assignment_id: string) => ({
                url: `/api/student/assignment/${assignment_id}`,
                method: 'GET',
            }),
            providesTags: ['Assignment'],
            keepUnusedDataFor: 0,
        }),

        // Submit assignment 
        submitAssignment: builder.mutation({
            query: ({ assignment_id, answers }: { assignment_id: string; answers: { question_id: string; answer_text: string }[] }) => ({
                url: `/api/student/assignment/${assignment_id}/submit`,
                method: 'POST',
                body: { answers },
            }),
            invalidatesTags: ['Assignment'],
        }),

        // get assignment submission status 
        getAssignmentSubmissionStatus: builder.query({
            query: (assignment_id: string) => ({
                url: `/api/student/assignment/${assignment_id}/submission`,
                method: 'GET',
            }),
            providesTags: ['Assignment'],
            keepUnusedDataFor: 0,
        }),

        // get all quizzes 
        getAllQuizzes: builder.query({
            query: ({ page = DEFAULT_PAGINATION.page, limit = DEFAULT_PAGINATION.limit, search = DEFAULT_PAGINATION.search, type = DEFAULT_PAGINATION.type }: PaginationParams) => ({
                url: '/api/student/quiz',
                method: 'GET',
                params: { page, limit, search, type },
            }),
            providesTags: ['Assignment'],
            keepUnusedDataFor: 0,
        }),

        // get single quiz 
        getSingleQuiz: builder.query({
            query: (quiz_id: string) => ({
                url: `/api/student/quiz/${quiz_id}`,
                method: 'GET',
            }),
            providesTags: ['Assignment'],
            keepUnusedDataFor: 0,
        }),

        // submit quiz 
        submitQuiz: builder.mutation({
            query: ({ quiz_id, answers }: { quiz_id: string; answers: { question_id: string; answer_id: string }[] }) => ({
                url: `/api/student/quiz/${quiz_id}/submit`,
                method: 'POST',
                body: { answers },
            }),
            invalidatesTags: ['Assignment'],
        }),

        // get quiz submission 
        getQuizSubmissionStatus: builder.query({
            query: (quiz_id: string) => ({
                url: `/api/student/quiz/${quiz_id}/submission`,
                method: 'GET',
            }),
            providesTags: ['Assignment'],
            keepUnusedDataFor: 0,
        }),
    }),
});

export const {
    useGetAllAssignmentsQuery,
    useGetAllQuizzesQuery,
    useGetSingleAssignmentQuery,
    useGetAssignmentSubmissionStatusQuery,
    useGetSingleQuizQuery,
    useSubmitAssignmentMutation,
    useSubmitQuizMutation,
    useGetQuizSubmissionStatusQuery
} = assignmentApi;