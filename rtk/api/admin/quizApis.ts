import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';


export const quizApi = createApi({
    reducerPath: 'quizApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['Quiz', 'QuizDashboard'],
    endpoints: (builder) => ({

        // create quiz
        createQuiz: builder.mutation({
            query: (quiz) => ({
                url: '/api/admin/quiz',
                method: 'POST',
                body: quiz,
            }),
            invalidatesTags: ['Quiz', 'QuizDashboard'],
        }),
        // get all quizzes
        getAllQuizzes: builder.query({
            query: () => ({
                url: '/api/admin/quiz',
                method: 'GET',
            }),
            providesTags: ['Quiz'],
        }),

        // get single quiz
        getSingleQuiz: builder.query({
            query: (quiz_id: string) => ({
                url: `/api/admin/quiz/${quiz_id}`,
                method: 'GET',
            }),
            providesTags: ['Quiz'],
        }),

        // update quiz
        updateQuiz: builder.mutation({
            query: (quiz) => ({
                url: `/api/admin/quiz/${quiz.id}`,
                method: 'PATCH',
                body: quiz,
            }),
            invalidatesTags: ['Quiz', 'QuizDashboard'],
        }),

        // delete quiz
        deleteQuiz: builder.mutation({
            query: (quiz_id: string) => ({
                url: `/api/admin/quiz/${quiz_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Quiz', 'QuizDashboard'],
        }),


        // all data quiz
        getAllDataQuiz: builder.query({
            query: () => ({
                url: '/api/admin/quiz/dashboard',
                method: 'GET',
            }),
            providesTags: ['QuizDashboard'],
        }),

    }),
});

export const { useCreateQuizMutation, useGetAllQuizzesQuery, useGetSingleQuizQuery, useUpdateQuizMutation, useDeleteQuizMutation, useGetAllDataQuizQuery } = quizApi;