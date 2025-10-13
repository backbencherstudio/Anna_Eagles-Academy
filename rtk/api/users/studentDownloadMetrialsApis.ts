import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';


export const studentDownloadMaterialsApi = createApi({
    reducerPath: 'studentDownloadMaterialsApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['StudentDownloadMaterials'],
    endpoints: (builder) => ({

        // get all student download materials /api/student/materials?series_id=&course_id=
        getAllStudentDownloadMaterials: builder.query({
            query: ({ series_id, course_id, lecture_type, page, limit }: { series_id: string, course_id: string, lecture_type: string, page: number, limit: number }) => ({
                url: '/api/student/materials',
                method: 'GET',
                params: { series_id, course_id, lecture_type, page, limit },
            }),
            providesTags: ['StudentDownloadMaterials'],
            keepUnusedDataFor: 0,
        }),

        // get single student download material 
        getSingleStudentDownloadMaterial: builder.query({
            query: (material_id: string) => ({
                url: `/api/student/materials/${material_id}`,
                method: 'GET',
            }),
            providesTags: ['StudentDownloadMaterials'],
            keepUnusedDataFor: 0,
        }),
    }),
});

export const { useGetAllStudentDownloadMaterialsQuery, useGetSingleStudentDownloadMaterialQuery } = studentDownloadMaterialsApi;
