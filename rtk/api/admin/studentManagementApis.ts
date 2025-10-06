import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';


export const studentManagementApi = createApi({
    reducerPath: 'studentManagementApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['StudentManagement'],
    endpoints: (builder) => ({

        // get all students
        getAllStudents: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => ({
                url: '/api/admin/student',
                method: 'GET',
                params: { page, limit, search },
            }),
            providesTags: ['StudentManagement'],
        }),


        // get single student
        getSingleStudent: builder.query({
            query: (student_id: string) => ({
                url: `/api/admin/student/${student_id}`,
                method: 'GET',
            }),
            providesTags: ['StudentManagement'],
        }),

        // details download student
        detailsDownloadStudent: builder.mutation({
            query: (student_id: string) => ({
                url: `/api/admin/student/${student_id}/download`,
                method: 'GET',
            }),
        }),

        // restrict student
        restrictStudent: builder.mutation({
            query: ({ student_id, status }: { student_id: string, status: number | string }) => ({
                url: `/api/admin/student/${student_id}/status`,
                method: 'PATCH',
                body: { 
                    status: Number(status), 
                    student_id 
                }
            }),
        }),

        // email notification
        emailNotification: builder.mutation({
            query: (data: { student_id: string, message: string }) => ({
                url: `/api/admin/student/notify`,
                method: 'POST',
                body: data
            }),
        }),

    }),
});

export const {
    useGetAllStudentsQuery,
    useGetSingleStudentQuery,
    useDetailsDownloadStudentMutation,
    useRestrictStudentMutation,
    useEmailNotificationMutation,   
} = studentManagementApi;