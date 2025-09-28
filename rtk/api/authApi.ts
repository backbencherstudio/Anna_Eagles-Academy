import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  date_of_birth?: string;
  phone_number?: string;
  gender?: string;
  address?: string;
  type?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  authorization: {
    token: string;
    type: string;
  };
  type: 'admin' | 'user';
  user?: User;
}

export interface MeResponse {
  data?: User;
  user?: User;
  message?: string;
}



// Helper function to set token in cookies
const setToken = (token: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
  }
};

// Helper function to clear token from cookies
const clearToken = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: createAuthBaseQuery(),
  tagTypes: ['User', 'Auth'],
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: any) => {
        // Set token in cookie after successful login
        const token = response.authorization?.token || response.token || response.data?.token || response.data?.authorization?.token;
        if (token) {
          setToken(token);
        }
        return response;
      },
      invalidatesTags: ['User', 'Auth'],
    }),

    // Register endpoint
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: any) => {
        // Set token in cookie after successful registration
        const token = response.authorization?.token || response.token || response.data?.token || response.data?.authorization?.token;
        if (token) {
          setToken(token);
        }
        return response;
      },
      invalidatesTags: ['User', 'Auth'],
    }),

    // Check authentication (me) endpoint
    checkAuth: builder.query<MeResponse, void>({
      query: () => ({
        url: '/api/auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    // Forgot password endpoint
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/api/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Logout (client-side only)
    logout: builder.mutation<{ success: boolean }, void>({
      queryFn: () => {
        clearToken();
        return { data: { success: true } };
      },
      invalidatesTags: ['User', 'Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useCheckAuthQuery,
  useForgotPasswordMutation,
  useLogoutMutation,
} = authApi;
