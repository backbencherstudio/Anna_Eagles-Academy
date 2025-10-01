import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';


// create card 
export const cardGeneratorApi = createApi({
    reducerPath: 'cardGeneratorApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['CardGenerator'],
    endpoints: (builder) => ({

        // create card 
        createCard: builder.mutation({
            query: (card) => ({
                url: '/api/admin/card-generator',
                method: 'POST',
                body: card,
            }),
            invalidatesTags: ['CardGenerator'],
        }),

        // get all cards 
        getAllCards: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => ({
                url: '/api/admin/card-generator',
                method: 'GET',
                params: { page, limit, search },
            }),
            providesTags: ['CardGenerator'],
        }),
    }),
});

export const { useCreateCardMutation, useGetAllCardsQuery } = cardGeneratorApi;