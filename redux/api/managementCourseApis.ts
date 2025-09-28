import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/axisoClients';


export const managementCourseApi = createApi({
    reducerPath: 'managementCourseApi',
    baseQuery: createBaseQuery(),
    tagTypes: ['ManagementCourse', 'Course'],
    endpoints: (builder) => ({

        // ==================this is create course==================

        // Create series
        createSeries: builder.mutation({
            query: (formData: FormData) => ({
                url: '/api/admin/series',
                method: 'POST',
                data: formData,
            }),
            invalidatesTags: ['ManagementCourse', 'Course'],
        }),

        // create module
        createModule: builder.mutation({
            query: (formData: FormData) => ({
                url: '/api/admin/series/course',
                method: 'POST',
                data: formData,
            }),
            invalidatesTags: ['ManagementCourse'],
        }),

        // create lesson
        createLesson: builder.mutation({
            query: (formData: FormData) => ({
                url: '/api/admin/series/lesson-file',
                method: 'POST',
                data: formData,
            }),
            invalidatesTags: ['ManagementCourse'],
        }),


        // ==================this is for get single course==================

        // get all courses with pagination and search
        getAllCourses: builder.query({
            query: ({ search = '', page = 1, limit = 8 }: { search?: string; page?: number; limit?: number }) => ({
                url: '/api/admin/series',
                method: 'GET',
                params: { search, page, limit },
            }),
            providesTags: ['ManagementCourse', 'Course'],
        }),

        // get modules title with series id (this is filtered by series id)
        getAllModulesTitle: builder.query({
            query: (series_id: string) => ({
                url: `/api/admin/series/courses/${series_id}`,
                method: 'GET',
            }),
        }),


        // get single series 
        getSingleSeries: builder.query({
            query: (series_id: string,) => ({
                url: `/api/admin/series/${series_id}`,
                method: 'GET',
            }),
            providesTags: (result, error, series_id) => [
                { type: 'ManagementCourse', id: series_id },
                { type: 'Course', id: series_id }
            ],
        }),

        // single module
        getSingleModule: builder.query({
            query: (module_id: string) => ({
                url: `/api/admin/series/courses/${module_id}`,
                method: 'GET',
            }),
        }),


        // get all modules  
        getAllModules: builder.query({
            query: (series_id: string) => ({
                url: `/api/admin/series/courses`,
                method: 'GET',
                params: { series_id },
            }),
            providesTags: ['ManagementCourse'],
        }),

        // single lesson
        getSingleLesson: builder.query({
            query: (lesson_id: string) => ({
                url: `/api/admin/series/lessons/${lesson_id}`,
                method: 'GET',
            }),
        }),

        // get all lessons by course/module id
        getAllLessons: builder.query({
            query: (course_id: string) => ({
                url: `/api/admin/series/lessons`,
                method: 'GET',
                params: { course_id },
            }),
            providesTags: ['ManagementCourse'],
        }),






        // ==================this is update single course==================

        // update single series
        updateSingleSeries: builder.mutation({
            query: ({ series_id, formData }: { series_id: string; formData: FormData }) => ({
                url: `/api/admin/series/${series_id}`,
                method: 'PATCH',
                data: formData,
            }),
            invalidatesTags: (result, error, { series_id }) => [
                { type: 'ManagementCourse', id: series_id },
                { type: 'Course', id: series_id },
                'ManagementCourse',
                'Course'
            ],
        }),

        // update single module
        updateSingleModule: builder.mutation({
            query: ({ module_id, formData }: { module_id: string; formData: FormData }) => ({
                url: `/api/admin/series/course/${module_id}`,
                method: 'PATCH',
                data: formData,
            }),
            invalidatesTags: ['ManagementCourse'],
        }),


        // update single lesson
        updateSingleLesson: builder.mutation({
            query: ({ lesson_id, formData }: { lesson_id: string; formData: FormData }) => ({
                url: `/api/admin/series/lesson/${lesson_id}`,
                method: 'PATCH',
                data: formData,
            }),
            invalidatesTags: ['ManagementCourse'],
        }),




        // ==================this is delete single course==================


        // delete single series
        deleteSingleSeries: builder.mutation({
            query: (series_id: string) => ({
                url: `/api/admin/series/${series_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ManagementCourse', 'Course'],
        }),

        // delete single module 
        deleteSingleModule: builder.mutation({
            query: (module_id: string) => ({
                url: `/api/admin/series/course/${module_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ManagementCourse'],
        }),

        // delete single lesson
        deleteSingleLesson: builder.mutation({
            query: (lesson_id: string) => ({
                url: `/api/admin/series/lesson-file/${lesson_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ManagementCourse'],
        }),



    }),
});

export const { useCreateSeriesMutation, useCreateModuleMutation, useGetAllCoursesQuery, useGetAllModulesTitleQuery, useGetAllModulesQuery, useGetSingleSeriesQuery, useGetSingleModuleQuery, useGetSingleLessonQuery, useUpdateSingleSeriesMutation, useUpdateSingleModuleMutation, useUpdateSingleLessonMutation, useCreateLessonMutation, useDeleteSingleModuleMutation, useGetAllLessonsQuery, useDeleteSingleLessonMutation, useDeleteSingleSeriesMutation } = managementCourseApi;
