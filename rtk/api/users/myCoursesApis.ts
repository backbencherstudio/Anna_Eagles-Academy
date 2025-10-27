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
            keepUnusedDataFor: 0,
        }),

        // get single leson   
        getSingleLesson: builder.query({
            query: (lesson_id: string) => ({
                url: `/api/student/series/lessons/${lesson_id}`,
                method: 'GET',
            }),
            providesTags: ['MyCourses'],
            keepUnusedDataFor: 0,
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


        // intro video progress set  


        setIntroVideoProgress: builder.mutation({
            query: ({ course_id, time_spent, last_position, completion_percentage }: { course_id: string, time_spent: number, last_position: number, completion_percentage: number }) => ({
                url: `/api/student/series/courses/${course_id}/intro-video/progress`,
                method: 'POST',
                body: { time_spent, last_position, completion_percentage },
            }),
            invalidatesTags: ['MyCourses'],
        }),


        // end video progress set  

        setEndVideoProgress: builder.mutation({
            query: ({ course_id, time_spent, last_position, completion_percentage }: { course_id: string, time_spent: number, last_position: number, completion_percentage: number }) => ({
                url: `/api/student/series/courses/${course_id}/end-video/progress`,
                method: 'POST',
                body: { time_spent, last_position, completion_percentage },
            }),
            invalidatesTags: ['MyCourses'],
        }),


        // lesson video progress set  


        setLessonVideoProgress: builder.mutation({
            query: ({ lesson_id, time_spent, last_position, completion_percentage }: { lesson_id: string, time_spent: number, last_position: number, completion_percentage: number }) => ({
                url: `/api/student/series/lessons/${lesson_id}/progress`,
                method: 'POST',
                body: { time_spent, last_position, completion_percentage },
            }),
            invalidatesTags: ['MyCourses'],
        }),




        // strimming lesson video play  /api/student/series/lessons/cmh76f98f0006wsz4uhpijmiq/stream

        useSetStrimmingLessonVideoPlayMutation: builder.mutation({
            query: ({ lesson_id, strimming_video_url }: { lesson_id: string, strimming_video_url: string }) => ({
                url: `/api/student/series/lessons/${lesson_id}/stream`,
                method: 'GET',
                body: { strimming_video_url },
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
