import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';


// Teacher Section APIs
export const teacherSectionApi = createApi({
    reducerPath: 'teacherSectionApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['TeacherSection'],
    endpoints: (builder) => ({

        // Create 
        createTeacherSection: builder.mutation({
            query: (teacherSection) => ({
                url: '/api/admin/teacher-section',
                method: 'POST',
                body: teacherSection,
            }),
            invalidatesTags: ['TeacherSection'],
        }),

        // Get all 
        getAllDataSections: builder.query({
            query: ({ section_type = '', search = '', limit = 10, page = 1 }) => ({
                url: '/api/admin/teacher-section',
                method: 'GET',
                params: { section_type, search, limit, page },
            }),
            providesTags: ['TeacherSection'],
        }),

        // get single 
        getSingleTeacherSection: builder.query({
            query: (teacher_section_id: string) => ({
                url: `/api/admin/teacher-section/${teacher_section_id}`,
                method: 'GET',
            }),
            providesTags: ['TeacherSection'],
        }),


        // update 
        updateTeacherSection: builder.mutation({
            query: (teacherSection) => ({
                url: `/api/admin/teacher-section/${teacherSection.id}`,
                method: 'PATCH',
                body: teacherSection,
            }),
            invalidatesTags: ['TeacherSection'],
        }),

        // delete 
        deleteTeacherSection: builder.mutation({
            query: (teacher_section_id: string) => ({
                url: `/api/admin/teacher-section/${teacher_section_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['TeacherSection'],
        }),
    }),
});

export const {
    useCreateTeacherSectionMutation,
    useGetAllDataSectionsQuery,
    useGetSingleTeacherSectionQuery,
    useUpdateTeacherSectionMutation,
    useDeleteTeacherSectionMutation,
} = teacherSectionApi;