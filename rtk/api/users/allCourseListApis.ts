import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';
import { PaginationParams, DEFAULT_PAGINATION } from '@/lib/paginationTypes';


// get all course list /api/student/checkout/series?search=&type=&page&limit

export const allCourseListApi = createApi({
    reducerPath: 'allCourseListApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['AllCourseList'],
    endpoints: (builder) => ({
        getAllCourseList: builder.query({
            query: ({ page = DEFAULT_PAGINATION.page, limit = DEFAULT_PAGINATION.limit, search = DEFAULT_PAGINATION.search, type = DEFAULT_PAGINATION.type }: PaginationParams) => ({
                url: '/api/student/checkout/series',
                method: 'GET',
                params: { page, limit, search, type },
            }),
            providesTags: ['AllCourseList'],
        }),
    }),
});

export const { useGetAllCourseListQuery } = allCourseListApi;

