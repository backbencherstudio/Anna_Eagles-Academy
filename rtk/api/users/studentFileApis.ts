import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

// create student file
export const studentFileApi = createApi({
    reducerPath: 'studentFileApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['StudentFile'],
    endpoints: (builder) => ({

        // create student file
        createStudentFile: builder.mutation({
            query: (file: FormData) => ({
                url: '/api/student/student-files',
                method: 'POST',
                body: file,
            }),
            invalidatesTags: ['StudentFile'],
        }),

        // get all student files 
        getAllStudentFiles: builder.query({
            query: ({ section_type = '' }) => ({
                url: '/api/student/student-files',
                method: 'GET',
                params: { section_type },
            }),
            providesTags: ['StudentFile'],
            keepUnusedDataFor: 0,
        }),

        // get single 
        getSingleStudentFile: builder.query({
            query: (file_id: string) => ({
                url: `/api/student/student-files/${file_id}`,
                method: 'GET',
            }),
            providesTags: ['StudentFile'],
        }),

        // delete student 
        deleteStudentFile: builder.mutation({
            query: (file_id: string) => ({
                url: `/api/student/student-files/${file_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['StudentFile'],
        }),
    }),
});

export const { useCreateStudentFileMutation, useGetAllStudentFilesQuery, useGetSingleStudentFileQuery, useDeleteStudentFileMutation } = studentFileApi;