import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';


// get all notifications
export const notificationsApi = createApi({
    reducerPath: 'notificationsApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['Notifications'],
    endpoints: (builder) => ({
        // get all notifications /api/student/notifications
        getAllNotifications: builder.query({
            // include userId in args so cache is user-scoped
            query: (_args: { userId: string }) => ({
                url: '/api/student/notification',
                method: 'GET',
            }),
            providesTags: ['Notifications'],
            keepUnusedDataFor: 0,
        }),

        // delete single notification 
        deleteSingleNotification: builder.mutation({
            query: (notification_id: string) => ({
                url: `/api/student/notification/${notification_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Notifications'],
          
        }),

        // delete multiple notifications
        deleteMultipleNotifications: builder.mutation({
            query: (notification_ids: string[]) => ({
                url: `/api/student/notification`,
                method: 'DELETE',
                body: { notification_ids },
            }),
            invalidatesTags: ['Notifications'],
          
        }),
    }),
});
export const { useGetAllNotificationsQuery, useDeleteSingleNotificationMutation, useDeleteMultipleNotificationsMutation } = notificationsApi;