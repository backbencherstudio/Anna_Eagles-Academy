import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/axisoClients';


// get all student list 
export const filterStudentListApi = createApi({
    reducerPath: 'filterStudentListApi',
    baseQuery: createBaseQuery(),
    tagTypes: ['FilterStudentList'],
    endpoints: (builder) => ({

        // get all student list /api/admin/student/name-email

        getAllStudentList: builder.query({
            query: () => ({
                url: '/api/admin/student/name-email',
                method: 'GET',
            }),
            providesTags: ['FilterStudentList'],
        }),

    }),
});

export const { useGetAllStudentListQuery } = filterStudentListApi;
