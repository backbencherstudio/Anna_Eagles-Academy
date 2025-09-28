import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/lib/axisoClients';

export const manageMaterialsApi = createApi({
    reducerPath: 'manageMaterialsApi',
    baseQuery: createBaseQuery(),
    tagTypes: ['Materials'],
    endpoints: (builder) => ({
        // ================== CREATE MATERIALS ==================
        
        // Create material
        createMaterial: builder.mutation({
            query: (formData: FormData) => ({
                url: '/api/admin/materials',
                method: 'POST',
                data: formData,
            }),
            invalidatesTags: ['Materials'],
        }),

        // ================== GET MATERIALS ==================
        
        // Get all materials with pagination and search
        getAllMaterials: builder.query({
            query: ({ search = '', page = 1, limit = 10, lecture_type = '' }: { search?: string; page?: number; limit?: number; lecture_type?: string }) => ({
                url: '/api/admin/materials',
                method: 'GET',
                params: { search, page, limit, lecture_type },
            }),
            providesTags: ['Materials'],
        }),

        // Get single material
        getSingleMaterial: builder.query({
            query: (material_id: string) => ({
                url: `/api/admin/materials/${material_id}`,
                method: 'GET',
            }),
            providesTags: (result, error, material_id) => [
                { type: 'Materials', id: material_id }
            ],
        }),

        // ================== UPDATE MATERIALS ==================
        
        // Update single material
        updateSingleMaterial: builder.mutation({
            query: ({ material_id, formData }: { material_id: string; formData: FormData }) => ({
                url: `/api/admin/materials/${material_id}`,
                method: 'PATCH',
                data: formData,
            }),
            invalidatesTags: (result, error, { material_id }) => [
                { type: 'Materials', id: material_id },
                'Materials'
            ],
        }),

        // ================== DELETE MATERIALS ==================
        
        // Delete single material
        deleteSingleMaterial: builder.mutation({
            query: (material_id: string) => ({
                url: `/api/admin/materials/${material_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Materials'],
        }),
    }),

    
});

// Export hooks for usage in functional components
export const {
    useCreateMaterialMutation,
    useGetAllMaterialsQuery,
    useGetSingleMaterialQuery,
    useUpdateSingleMaterialMutation,
    useDeleteSingleMaterialMutation,
} = manageMaterialsApi;