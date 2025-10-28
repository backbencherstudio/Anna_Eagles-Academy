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
export const filterSeriesListApi = createApi({
    reducerPath: 'filterSeriesListApi',
    baseQuery: createBaseQuery(),
    tagTypes: ['FilterSeriesList'],
    endpoints: (builder) => ({
        // Get all series with their courses for dropdown filtering
        getSeriesWithCourses: builder.query<SeriesTitleResponse, void>({
            query: () => ({
                url: '/api/student/series/series-title',
                method: 'GET',
            }),
            providesTags: ['FilterSeriesList'],
            keepUnusedDataFor: 0,
        }),
    }),
});

export const { useGetSeriesWithCoursesQuery } = filterSeriesListApi;

