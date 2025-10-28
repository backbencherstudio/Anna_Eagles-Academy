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
export const downloadAcademyDiplomaCertificateApi = createApi({
    reducerPath: 'downloadAcademyDiplomaCertificateApi',
    baseQuery: createAuthBaseQuery(),

    endpoints: (builder) => ({
        // download Academy Diploma Certificate
        downloadAcademyDiplomaCertificate: builder.mutation({
            query: (id: string) => ({
                url: `/api/student/diploma-certificate/${id}/download`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetAllCompletedCourseCertificateQuery } = getAllCompletedCourseCertificateApi;
export const { useGetSingleCompletedCourseCertificateQuery, useLazyGetSingleCompletedCourseCertificateQuery } = getSingleCompletedCourseCertificateApi;
export const { useDownloadAcademyDiplomaCertificateMutation } = downloadAcademyDiplomaCertificateApi;