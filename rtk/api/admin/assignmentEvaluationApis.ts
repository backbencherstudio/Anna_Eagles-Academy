import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';


// get all assignment evaluations
export const assignmentEvaluationApi = createApi({
    reducerPath: 'assignmentEvaluationApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['AssignmentEvaluation'],
    endpoints: (builder) => ({

        // get all assignment evaluations  
        getAllAssignmentEvaluations: builder.query({
            query: ({ page = 1, limit = 8, search = '', series_id = '', course_id = '' }: { page?: number; limit?: number; search?: string; series_id?: string; course_id?: string }) => ({
                url: '/api/admin/assignment-submission',
                method: 'GET',
                params: { page, limit, search, series_id, course_id },
            }),
            providesTags: ['AssignmentEvaluation'],
        }),


        //  get single assignment evaluation
        getSingleAssignmentEvaluation: builder.query({
            query: (assignment_id: string) => ({
                url: `/api/admin/assignment-submission/${assignment_id}`,
                method: 'GET',
            }),
            providesTags: ['AssignmentEvaluation'],
        }),

        // create or update submission grading in one POST
        getSubmissionGrade: builder.mutation({
            query: ({ assignment_id, grades }: { assignment_id: string, grades?: any }) => ({
                url: `/api/admin/assignment-submission/${assignment_id}/grade`,
                method: 'POST',
                body: grades,
            }),
            invalidatesTags: ['AssignmentEvaluation'],
        }),

        // legacy: grade update via PATCH (kept for compatibility but unused)
        gradeUpdate: builder.mutation({
            query: ({ assignment_id, grades }: { assignment_id: string, grades: any }) => ({
                url: `/api/admin/assignment-submission/${assignment_id}/grade`,
                method: 'PATCH',
                body: grades,
            }),
            invalidatesTags: ['AssignmentEvaluation'],
        }),
    }),
});


// get single assignment evaluation
export const { useGetAllAssignmentEvaluationsQuery, useGetSubmissionGradeMutation, useGetSingleAssignmentEvaluationQuery, useGradeUpdateMutation } = assignmentEvaluationApi;