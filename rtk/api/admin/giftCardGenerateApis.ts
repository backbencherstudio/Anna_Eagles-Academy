import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';



export const giftCardGenerateApi = createApi({
    reducerPath: 'giftCardGenerateApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['GiftCardGenerate'],
    endpoints: (builder) => ({

        // generate gift card
        generateGiftCard: builder.mutation({
            query: (giftCard) => ({
                url: '/api/admin/card-generator',
                method: 'POST',
                body: giftCard,
            }),
            invalidatesTags: ['GiftCardGenerate'],
        }),

        // get all gift cards 
        getAllGiftCards: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => ({
                url: '/api/admin/card-generator',
                method: 'GET',
                params: { page, limit, search },
            }),
            providesTags: ['GiftCardGenerate'],
        }),
    }),
});

export const { useGenerateGiftCardMutation, useGetAllGiftCardsQuery } = giftCardGenerateApi;