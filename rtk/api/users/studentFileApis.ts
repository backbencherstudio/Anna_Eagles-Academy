import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

// create student file
export const studentFileApi = createApi({
    reducerPath: 'studentFileApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['StudentFile'],
    endpoints: (builder) => ({

        // create student file
        createStudentFile: builder.mutation({
            query: (file: FormData) => ({
                url: '/api/student/student-files',
                method: 'POST',
                body: file,
            }),
            // Optimistically update the cached lists so UI doesn't hard-refetch
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const res: any = await queryFulfilled
                    const newItem = res?.data?.data
                    const section = newItem?.section_type
                    const argsList = [
                        { section_type: '' },
                        { section_type: section }
                    ]
                    argsList.forEach((args) => {
                        dispatch(studentFileApi.util.updateQueryData('getAllStudentFiles', args as any, (draft: any) => {
                            if (!draft?.data) return
                            if (!draft.data.student_files) draft.data.student_files = []
                            // Prepend newly created item
                            draft.data.student_files.unshift(newItem)
                            if (draft.data.pagination) {
                                draft.data.pagination.total = (draft.data.pagination.total || 0) + 1
                            }
                        }))
                    })
                } catch { }
            },
        }),

        // get all student files 
        getAllStudentFiles: builder.query({
            query: ({ section_type = '' }) => ({
                url: '/api/student/student-files',
                method: 'GET',
                params: { section_type },
            }),
            providesTags: ['StudentFile'],
            keepUnusedDataFor: 0,
        }),

        // get single 
        getSingleStudentFile: builder.query({
            query: (file_id: string) => ({
                url: `/api/student/student-files/${file_id}`,
                method: 'GET',
            }),
            providesTags: ['StudentFile'],
        }),

        // delete student 
        deleteStudentFile: builder.mutation({
            query: (file_id: string) => ({
                url: `/api/student/student-files/${file_id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(file_id, { dispatch, queryFulfilled }) {
                // Optimistically remove from caches for both filters
                const removeFromDraft = (draft: any) => {
                    if (!draft?.data?.student_files) return
                    draft.data.student_files = draft.data.student_files.filter((f: any) => f.id !== file_id)
                    if (draft.data.pagination) {
                        draft.data.pagination.total = Math.max(0, (draft.data.pagination.total || 1) - 1)
                    }
                }
                const patches = [
                    dispatch(studentFileApi.util.updateQueryData('getAllStudentFiles', { section_type: '' } as any, removeFromDraft)),
                    dispatch(studentFileApi.util.updateQueryData('getAllStudentFiles', { section_type: 'weekly-video-diary' } as any, removeFromDraft)),
                    dispatch(studentFileApi.util.updateQueryData('getAllStudentFiles', { section_type: 'other-document' } as any, removeFromDraft)),
                ]
                try {
                    await queryFulfilled
                } catch {
                   
                }
            },
        }),
    }),
});

export const { useCreateStudentFileMutation, useGetAllStudentFilesQuery, useGetSingleStudentFileQuery, useDeleteStudentFileMutation } = studentFileApi;