import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthBaseQuery } from '@/lib/axisoClients';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  avatar_url?: string;
  createdAt?: string;
  updatedAt?: string;
  date_of_birth?: string;
  phone_number?: string;
  whatsapp_number?: string;
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

export interface UpdateProfileRequest {
  name?: string;
  date_of_birth?: string;
  phone_number?: string;
  whatsapp_number?: string;
  gender?: string;
  address?: string;
  avatar?: string;
  image?: File;
}


export interface AuthResponse {
  success: boolean;
  message: string;
  authorization: {
    token: string;
    type: string;
  };
  type: '';
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
    const isProduction = process.env.NODE_ENV === 'production';
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';

    // Use 'secure' only if in production and using HTTPS
    const secureFlag = isProduction && isSecure ? 'secure;' : '';
    // Use 'lax' instead of 'strict' for better cross-domain support
    const cookieString = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; ${secureFlag} samesite=lax`;
    document.cookie = cookieString;
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


    // login with google
    loginWithGoogle: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/api/auth/google',
        method: 'GET',
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
      // providesTags: ['User'],
    }),

    // Forgot password endpoint
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/api/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: ['User', 'Auth'],
    }),

    // reset password pass body: { email: string, token: string, password: string }
    resetPassword: builder.mutation<{ success: boolean, message: string }, { email: string, token: string, password: string }>({
      query: ({ email, token, password }) => ({
        url: '/api/auth/reset-password',
        method: 'POST',
        body: { email, token, password },
      }),
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: ['User', 'Auth'],
    }),


    // Update profile
    updateProfile: builder.mutation<{ message: string, user: User }, UpdateProfileRequest | FormData>({
      query: (data) => ({
        url: '/api/auth/update',
        method: 'PATCH',
        body: data,
      }),

    }),

    // change password
    changePassword: builder.mutation<{ success: boolean, message: string }, { old_password: string, new_password: string }>({
      query: (data) => ({
        url: '/api/auth/change-password',
        method: 'POST',
        body: data,
      }),

    }),

    // Logout 
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
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useLoginWithGoogleMutation,
} = authApi;
