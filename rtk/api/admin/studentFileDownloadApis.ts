import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

export const studentFileDownloadApi = createApi({
    reducerPath: 'studentFileDownloadApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['StudentFileDownload'],
    endpoints: (builder) => ({

        // get all student file downloads 
        getAllStudentFileDownloads: builder.query({
            query: ({ section_type = '', search = '', limit = 10, page = 1, series_id = '', course_id = '' }: { section_type?: string; search?: string; limit?: number; page?: number; series_id?: string; course_id?: string }) => ({
                url: '/api/admin/student-files',
                method: 'GET',
                params: { section_type, search, limit, page, series_id, course_id },
            }),
            providesTags: ['StudentFileDownload'],
        }),

        // get single student file download 
        getSingleStudentFileDownload: builder.query({
            query: (student_file_download_id: string) => ({
                url: `/api/admin/student-files/${student_file_download_id}`,
                method: 'GET',
            }),
            providesTags: ['StudentFileDownload'],
        }),

    }),
});

export const { useGetAllStudentFileDownloadsQuery, useGetSingleStudentFileDownloadQuery } = studentFileDownloadApi;

