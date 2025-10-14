import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

// Types
export interface ContactTeacherRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  whatsapp_number: string;
  reason: string;
  message: string;
  date: string;
}

export interface ContactTeacherResponse {
  success: boolean;
  message: string;
  data?: any;
}

// API
export const contactTeacherApi = createApi({
  reducerPath: 'contactTeacherApi',
  baseQuery: createAuthBaseQuery(),
  tagTypes: ['ContactTeacher'],
  endpoints: (builder) => ({
    contactTeacher: builder.mutation<ContactTeacherResponse, ContactTeacherRequest>({
      query: (data) => ({
        url: '/api/student/contact',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ContactTeacher'],
    }),
  }),
});

export const { useContactTeacherMutation } = contactTeacherApi;