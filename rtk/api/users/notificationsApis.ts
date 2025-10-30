import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';


// ================Notifications APIs=================
export const notificationsApi = createApi({
    reducerPath: 'notificationsApi',
    baseQuery: createAuthBaseQuery(),
    tagTypes: ['Notifications'],
    endpoints: (builder) => ({

        // ================User Notifications=================
        // get all notifications /api/student/notifications
        getAllNotifications: builder.query({
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

        // ================Admin Notifications=================
        // get all admin notifications
        getAdminNotifications: builder.query({
            query: () => ({
                url: '/api/admin/notification',
                method: 'GET',
            }),
            providesTags: ['Notifications'],
            keepUnusedDataFor: 0,
        }),

        // delete admin notification
        deleteAdminNotification: builder.mutation({
            query: (notification_id: string) => ({
                url: `/api/admin/notification/${notification_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Notifications'],
        }),

        // delete multiple admin notifications
        deleteMultipleAdminNotifications: builder.mutation({
            query: (notification_ids: string[]) => ({
                url: `/api/admin/notification`,
                method: 'DELETE',
                body: { notification_ids },
            }),
            invalidatesTags: ['Notifications'],
        }),
    }),
});
export const { useGetAllNotificationsQuery, useDeleteSingleNotificationMutation, useDeleteMultipleNotificationsMutation, useGetAdminNotificationsQuery, useDeleteAdminNotificationMutation, useDeleteMultipleAdminNotificationsMutation } = notificationsApi;