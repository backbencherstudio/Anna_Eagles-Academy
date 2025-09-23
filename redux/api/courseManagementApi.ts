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

export const courseManagementApi = createApi({
  reducerPath: 'courseManagementApi',
  baseQuery,
  tagTypes: ['Course'],
  endpoints: (builder) => ({
    // Create course
    createCourse: builder.mutation({
      query: (formData: FormData) => ({
        url: '/api/admin/series',
        method: 'POST',
        data: formData,
      }),
      invalidatesTags: ['Course'],
    }),

    // Get all courses with pagination and search
    getAllCourses: builder.query({
      query: ({ search = '', page = 1, limit = 8 }: { search?: string; page?: number; limit?: number }) => ({
        url: '/api/admin/series',
        method: 'GET',
        params: { search, page, limit },
      }),
      providesTags: ['Course'],
    }),

    // Get single course
    getSingleCourse: builder.query({
      query: (id: string) => ({
        url: `/api/admin/series/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),

    // Update course
    updateCourse: builder.mutation({
      query: ({ id, formData }: { id: string; formData: FormData }) => ({
        url: `/api/admin/series/${id}`,
        method: 'PATCH',
        data: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Course', id }, 'Course'],
    }),

    // Delete course
    deleteCourse: builder.mutation({
      query: (id: string) => ({
        url: `/api/admin/series/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Course'],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetSingleCourseQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseManagementApi;
