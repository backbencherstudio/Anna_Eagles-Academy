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

    }),
});

export const {
    useCreateTeacherSectionMutation,
    useGetAllDataSectionsQuery,
} = teacherSectionApi;