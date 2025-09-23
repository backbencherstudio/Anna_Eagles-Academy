import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axiosClient from '@/lib/axisoClients';

// Custom base query using axiosClient
const baseQuery = async (args: { url: string; method: string; data?: any; params?: any }) => {
    try {
        const { url, method, data, params } = args;

        let response;
        switch (method.toUpperCase()) {
            case 'GET':
                response = await axiosClient.get(url, { params });
                break;
            case 'POST':
                response = await axiosClient.post(url, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                break;
            case 'PATCH':
                response = await axiosClient.patch(url, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                break;
            case 'DELETE':
                response = await axiosClient.delete(url);
                break;
            default:
                throw new Error(`Unsupported method: ${method}`);
        }

        return { data: response.data };
    } catch (error: any) {
        return {
            error: {
                status: error.response?.status,
                data: error.response?.data || error.message,
            },
        };
    }
};


export const managementCourseApi = createApi({
    reducerPath: 'managementCourseApi',
    baseQuery,
    tagTypes: ['ManagementCourse'],
    endpoints: (builder) => ({

        // ==================this is create course==================

        // Create series
        createSeries: builder.mutation({
            query: (formData: FormData) => ({
                url: '/api/admin/series',
                method: 'POST',
                data: formData,
            }),
            invalidatesTags: ['ManagementCourse'],
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
        }),




        // ==================this is delete single course==================


        // delete single series
        deleteSingleSeries: builder.mutation({
            query: (series_id: string) => ({
                url: `/api/admin/series/${series_id}`,
                method: 'DELETE',
            }),
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
                url: `/api/admin/series/lessons/${lesson_id}`,
                method: 'DELETE',
            }),
        }),



    }),
});

export const { useCreateSeriesMutation, useCreateModuleMutation, useGetAllModulesTitleQuery, useGetAllModulesQuery, useGetSingleSeriesQuery, useGetSingleModuleQuery, useGetSingleLessonQuery, useUpdateSingleSeriesMutation, useUpdateSingleModuleMutation, useUpdateSingleLessonMutation, useCreateLessonMutation, useDeleteSingleModuleMutation, useGetAllLessonsQuery, useDeleteSingleLessonMutation } = managementCourseApi;
