import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';
import { PaginationParams, DEFAULT_PAGINATION } from '@/lib/paginationTypes';



export const allCourseListApi = createApi({
    reducerPath: 'allCourseListApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['AllCourseList'],
    endpoints: (builder) => ({

        // get all course list
        getAllCourseList: builder.query({
            query: ({ page = DEFAULT_PAGINATION.page, limit = DEFAULT_PAGINATION.limit, search = DEFAULT_PAGINATION.search, type = DEFAULT_PAGINATION.type }: PaginationParams) => ({
                url: '/api/student/checkout/series',
                method: 'GET',
                params: { page, limit, search, type },
            }),
            providesTags: ['AllCourseList'],

        }),
        // single course list 
        getSingleCourseList: builder.query({
            query: (course_id: string) => ({
                url: `/api/student/checkout/${course_id}/series-summary`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetAllCourseListQuery, useGetSingleCourseListQuery } = allCourseListApi;

