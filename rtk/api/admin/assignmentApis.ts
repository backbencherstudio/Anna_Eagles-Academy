import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

//  Assignment APIs
export const assignmentApi = createApi({
    reducerPath: 'assignmentApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['Assignment'],
    endpoints: (builder) => ({


        // Create assignment
        createAssignment: builder.mutation({
            query: (assignment) => ({
                url: '/api/admin/assignment',
                method: 'POST',
                body: assignment,
            }),
            invalidatesTags: ['Assignment'],
        }),

        // Get all assignments (dashboard)
        getAllAssignments: builder.query({
            query: () => ({
                url: '/api/admin/assignment/dashboard',
                method: 'GET',
            }),
            providesTags: ['Assignment'],
        }),


        // Get single assignment 
        getSingleAssignment: builder.query({
            query: (assignment_id: string) => ({
                url: `/api/admin/assignment/${assignment_id}`,
                method: 'GET',
            }),
            providesTags: ['Assignment'],
        }),

        // Update assignment
        updateAssignment: builder.mutation({
            query: (assignment) => ({
                url: `/api/admin/assignment/${assignment.id}`,
                method: 'PATCH',
                body: assignment,
            }),
            invalidatesTags: ['Assignment'],
        }),


        // Delete assignment
        deleteAssignment: builder.mutation({
            query: (assignment_id: string) => ({
                url: `/api/admin/assignment/${assignment_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Assignment'],
        }),
    }),
});

export const { useCreateAssignmentMutation, useGetAllAssignmentsQuery, useGetSingleAssignmentQuery, useUpdateAssignmentMutation, useDeleteAssignmentMutation } = assignmentApi;
