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



        // watched history
        getWatchedHistory: builder.query({
            query: () => ({
                url: '/api/student/series/watched-lessons',
                method: 'GET',
            }),
            providesTags: ['MyCourses'],
            keepUnusedDataFor: 0,

        }),


        // intro video progress set  /api/student/series/courses/cmh76j86q000awsz4scztyu55/intro-video/progress
        //         {
        //     "time_spent":600,
        //     "last_position":600,
        //     "completion_percentage":100
        // } pass in body 

        setIntroVideoProgress: builder.mutation({
            query: ({ course_id, time_spent, last_position, completion_percentage }: { course_id: string, time_spent: number, last_position: number, completion_percentage: number }) => ({
                url: `/api/student/series/courses/${course_id}/intro-video/progress`,
                method: 'POST',
                body: { time_spent, last_position, completion_percentage },
            }),
            invalidatesTags: ['MyCourses'],
        }),


        // end video progress set  /api/student/series/courses/cmgyly7280007ws086d7t8f1b/end-video/progress
        //         {
        //     "time_spent":600,
        //     "last_position":600,
        //     "completion_percentage":100
        // } pass in body 

        setEndVideoProgress: builder.mutation({
            query: ({ course_id, time_spent, last_position, completion_percentage }: { course_id: string, time_spent: number, last_position: number, completion_percentage: number }) => ({
                url: `/api/student/series/courses/${course_id}/end-video/progress`,
                method: 'POST',
                body: { time_spent, last_position, completion_percentage },
            }),
            invalidatesTags: ['MyCourses'],
        }),


        // lesson video progress set  /api/student/series/lessons/cmgym2bkd000fws08dxqihjwe/progress
        //         {
        //     "time_spent":600,
        //     "last_position":600,
        //     "completion_percentage":100
        // } pass in body  

        setLessonVideoProgress: builder.mutation({
            query: ({ lesson_id, time_spent, last_position, completion_percentage }: { lesson_id: string, time_spent: number, last_position: number, completion_percentage: number }) => ({
                url: `/api/student/series/lessons/${lesson_id}/progress`,
                method: 'POST',
                body: { time_spent, last_position, completion_percentage },
            }),
            invalidatesTags: ['MyCourses'],
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
    useSetIntroVideoProgressMutation,
    useSetEndVideoProgressMutation,
    useSetLessonVideoProgressMutation
} = myCoursesApi;
