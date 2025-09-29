import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/axisoClients';

// Types for the API responses
export interface Course {
    id: string;
    title: string;
}

export interface SeriesWithCourses {
    id: string;
    title: string;
    created_at: string;
    courses: Course[];
}

export interface SeriesTitleResponse {
    success: boolean;
    message: string;
    data: SeriesWithCourses[];
}

// get all series with courses for filtering
export const courseFilterApi = createApi({
    reducerPath: 'courseFilterApi',
    baseQuery: createBaseQuery(),
    tagTypes: ['CourseFilter'],
    endpoints: (builder) => ({
        // Get all series with their courses for dropdown filtering
        getSeriesWithCourses: builder.query<SeriesTitleResponse, void>({
            query: () => ({
                url: '/api/admin/series/series-title',
                method: 'GET',
            }),
            providesTags: ['CourseFilter'],
        }),
    }),
});

export const { useGetSeriesWithCoursesQuery } = courseFilterApi;

