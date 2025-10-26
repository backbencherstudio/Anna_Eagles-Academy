import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

// get enrolled series
export const myCoursesApi = createApi({
    reducerPath: 'myCoursesApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['MyCourses'],
    endpoints: (builder) => ({

        // get enrolled series
        getEnrolledSeries: builder.query({
            query: () => ({
                url: '/api/student/series',
                method: 'GET',
            }),
            providesTags: ['MyCourses'],
            keepUnusedDataFor: 0,
        }),

        // get single enrolled series 
        getSingleEnrolledSeries: builder.query({
            query: (series_id: string) => ({
                url: `/api/student/series/single/${series_id}`,
                method: 'GET',
            }),
            providesTags: ['MyCourses'],
            keepUnusedDataFor: 0,
        }),

        // get single enrolled course
        getSingleEnrolledCourse: builder.query({
            query: (course_id: string) => ({
                url: `/api/student/series/courses/${course_id}`,
                method: 'GET',
            }),
            providesTags: ['MyCourses'],
            keepUnusedDataFor: 0, // No cache, always fetch fresh data
        }),

        // get single leson   
        getSingleLesson: builder.query({
            query: (lesson_id: string) => ({
                url: `/api/student/series/lessons/${lesson_id}`,
                method: 'GET',
            }),
            providesTags: ['MyCourses'],
            keepUnusedDataFor: 0, // No cache, always fetch fresh data
        }),


        // video progress set /api/student/series/lessons/cmguc9esb000aws90b43qqjhw/progress
        setVideoProgress: builder.mutation({
            query: ({ lesson_id, progress }: { lesson_id: string, progress: number }) => ({
                url: `/api/student/series/lessons/${lesson_id}/progress`,
                method: 'POST',
                body: { progress },
            }),
            invalidatesTags: ['MyCourses'],
        }),

        // watched history
        getWatchedHistory: builder.query({
            query: () => ({
                url: '/api/student/series/watched-lessons',
                method: 'GET',
            }),
            providesTags: ['MyCourses'],
            keepUnusedDataFor: 0,

        }),
    }),
});

export const {
    useGetEnrolledSeriesQuery,
    useGetSingleEnrolledSeriesQuery,
    useLazyGetSingleEnrolledSeriesQuery,
    useGetSingleEnrolledCourseQuery,
    useLazyGetSingleEnrolledCourseQuery,
    useGetSingleLessonQuery,
    useLazyGetSingleLessonQuery,
    useGetWatchedHistoryQuery,
    useSetVideoProgressMutation
} = myCoursesApi;
