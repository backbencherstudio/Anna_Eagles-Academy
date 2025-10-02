import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

export const scholarshipCodeGenerateApi = createApi({
    reducerPath: 'scholarshipCodeGenerateApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['ScholarshipCodeGenerate'],
    endpoints: (builder) => ({

        // generate scholarship code /api/admin/scholarship-code
        generateScholarshipCode: builder.mutation({
            query: (data) => ({
                url: '/api/admin/scholarship-code',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ScholarshipCodeGenerate'],
        }),


        // get all data scholarship code page
        getAllDataScholarshipCode: builder.query({
            query: ({ page = 1, limit = 8, search = '' }) => ({
                url: '/api/admin/scholarship-code',
                method: 'GET',
                params: { page, limit, search },
            }),
            providesTags: ['ScholarshipCodeGenerate'],
        }),
    }),
});

export const { useGenerateScholarshipCodeMutation, useGetAllDataScholarshipCodeQuery } = scholarshipCodeGenerateApi;
