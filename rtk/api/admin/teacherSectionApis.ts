import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/axisoClients';


// Teacher Section APIs
export const teacherSectionApi = createApi({
    reducerPath: 'teacherSectionApi',
    baseQuery: createBaseQuery(),
    tagTypes: ['TeacherSection'],
    endpoints: (builder) => ({

        // Create 
        createTeacherSection: builder.mutation({
            query: (teacherSection) => ({
                url: '/api/admin/teacher-section',
                method: 'POST',
                data: teacherSection,
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
                url: `/api/admin/teacher-section/${teacherSection.get('id')}`,
                method: 'PATCH',
                data: teacherSection,
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