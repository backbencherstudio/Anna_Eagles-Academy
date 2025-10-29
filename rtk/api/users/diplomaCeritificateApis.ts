import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';
import { PaginationParams, DEFAULT_PAGINATION } from '@/lib/paginationTypes';

// Type definitions for API response
export interface CourseCertificate {
    course_id: string;
    course_title: string;
    course_start_date: string;
    course_completion_date: string;
    course_status: string;
    completion_percentage: number;
    is_completed: boolean;
    progress_started_at: string;
    progress_created_at: string;
    progress_updated_at: string;
    certificate_id: string;
    series: {
        series_id: string;
        title: string;
        start_date: string;
        end_date: string;
    };
}

// Individual certificate response type
export interface SingleCertificateResponse {
    success: boolean;
    message: string;
    data: {
        lms_name: string;
        student_name: string;
        student_email: string;
        course_title: string;
        series_title: string;
        course_id: string;
        series_id: string;
        completion_date: string;
        completion_percentage: number;
        status: string;
        certificate_id: string;
        generated_at: string;
        series_start_date: string;
        series_end_date: string;
    };
}

// Diploma certificate response type (series-based)
export interface DiplomaCertificateResponse {
    success: boolean;
    message: string;
    data: {
        lms_name: string;
        student_name: string;
        student_email: string;
        series_title: string;
        series_id: string;
        enrollment_id: string;
        enrolled_at: string;
        completed_at: string | null; 
        series_start_date: string; 
        series_end_date: string; 
        total_courses: number;
        completed_courses: number;
        overall_completion_percentage: number;
        courses: Array<{
            course_id: string;
            course_title: string;
            completion_date: string; 
            completion_percentage: number;
        }>;
        diploma_id: string;
        generated_at: string;
        achievement_type: 'Diploma';
        program_duration: string;
    };
}

export interface CompletedCourseCertificateResponse {
    success: boolean;
    message: string;
    data: {
        total_series: number;
        total_courses: number;
        courses: CourseCertificate[];
    };
}

// get all completed course certificate list
export const getAllCompletedCourseCertificateApi = createApi({
    reducerPath: 'getAllCompletedCourseCertificateApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['CompletedCourseCertificate'],
    endpoints: (builder) => ({
        // get all completed course certificate /api/student/certificate/course-progress?page =&limit=&series_id=
        getAllCompletedCourseCertificate: builder.query<CompletedCourseCertificateResponse, { page?: number; limit?: number; series_id?: string } | void>({
            query: (arg: { page?: number; limit?: number; series_id?: string } | void) => ({
                url: `/api/student/certificate/course-progress`,
                method: 'GET',
                params: arg || {},
            }),
            providesTags: ['CompletedCourseCertificate'],
            keepUnusedDataFor: 0,
        }),
    }),
});

// single completed course certificate /api/student/certificate/data/:courseId
export const getSingleCompletedCourseCertificateApi = createApi({
    reducerPath: 'getSingleCompletedCourseCertificateApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['CompletedCourseCertificate'],
    endpoints: (builder) => ({
        // get single completed course certificate
        getSingleCompletedCourseCertificate: builder.query<SingleCertificateResponse, string>({
            query: (course_id: string) => ({
                url: `/api/student/certificate/data/${course_id}`,
                method: 'GET',
            }),
            providesTags: ['CompletedCourseCertificate'],
            keepUnusedDataFor: 0,
        }),
    }),
});

// download Academy Diploma Certificate
export const getAcademyDiplomaCertificateApi = createApi({
    reducerPath: 'getAcademyDiplomaCertificateApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['AcademyDiplomaCertificate'],

    endpoints: (builder) => ({
        // get Academy Diploma Certificate /api/student/certificate/diploma/:seriesId
        getAcademyDiplomaCertificate: builder.query<DiplomaCertificateResponse, string>({
            query: (seriesId: string) => ({
                url: `/api/student/certificate/diploma/${seriesId}`,
                method: 'GET',
            }),
            providesTags: ['AcademyDiplomaCertificate'],
            keepUnusedDataFor: 0,
        }),
    }),
});

export const { useGetAllCompletedCourseCertificateQuery } = getAllCompletedCourseCertificateApi;
export const { useGetSingleCompletedCourseCertificateQuery, useLazyGetSingleCompletedCourseCertificateQuery } = getSingleCompletedCourseCertificateApi;
export const { useGetAcademyDiplomaCertificateQuery, useLazyGetAcademyDiplomaCertificateQuery } = getAcademyDiplomaCertificateApi;