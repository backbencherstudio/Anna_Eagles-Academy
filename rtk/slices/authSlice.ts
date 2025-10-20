import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi, User } from '@/rtk/api/authApi';

// Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  lastAuthCheck: number | null;
  changePasswordLoading: boolean;
  changePasswordError: string | null;
  changePasswordSuccess: string | null;
}

// Normalize user data from API response
function normalizeUserData(input: any): User {
  return {
    id: input?.id || input?._id || 'unknown',
    name: input?.name || input?.username || 'User',
    email: input?.email || 'unknown@example.com',
    role: (input?.type === 'admin' || input?.role === 'admin') ? 'admin' : 'user',
    avatar: input?.avatar || input?.profileImage || undefined,
    avatar_url: input?.avatar_url || undefined,
    createdAt: input?.created_at || input?.createdAt || new Date().toISOString(),
    updatedAt: input?.updated_at || input?.updatedAt || new Date().toISOString(),
    date_of_birth: input?.date_of_birth || undefined,
    phone_number: input?.phone_number || undefined,
    whatsapp_number: input?.whatsapp_number || undefined,
    gender: input?.gender || undefined,
    address: input?.address || undefined,
    type: input?.type || undefined,
  };
}

// Reset the auth state consistently
function resetAuthState(state: AuthState) {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  state.error = null;
  state.isLoading = false;
  state.isInitialized = true;
  state.lastAuthCheck = null;
}

// Reset change password state
function resetChangePasswordState(state: AuthState) {
  state.changePasswordLoading = false;
  state.changePasswordError = null;
  state.changePasswordSuccess = null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
  lastAuthCheck: null,
  changePasswordLoading: false,
  changePasswordError: null,
  changePasswordSuccess: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      resetAuthState(state);
    },
    initializeFromToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      const basicUser = {
        id: 'temp-user',
        name: 'User',
        email: 'user@example.com',
        role: 'user' as const,
        type: 'user'
      };
      state.user = normalizeUserData(basicUser);
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.lastAuthCheck = Date.now();
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearChangePasswordState: (state) => {
      resetChangePasswordState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addMatcher(
        authApi.endpoints.login.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          const response = action.payload;

          state.token = response?.authorization?.token || null;

          if (response?.type) {
            const userData = {
              id: 'temp-id',
              name: 'User',
              email: 'user@example.com',
              role: response.type === 'admin' ? 'admin' : 'user',
              type: response.type
            };
            state.user = normalizeUserData(userData);
            state.isAuthenticated = true;
          } else {
            const userData = response?.user ?? null;
            if (userData) {
              state.user = normalizeUserData(userData);
              state.isAuthenticated = true;
            } else {
              state.user = null;
              state.isAuthenticated = Boolean(state.token);
            }
          }

          state.error = null;
          state.isInitialized = true;
          state.lastAuthCheck = Date.now();
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          
          let errorMessage = 'Login failed';
          if (action.payload?.data?.message?.message) {
            errorMessage = action.payload.data.message.message;
          } else if (action.payload?.data?.message) {
            errorMessage = action.payload.data.message;
          } else if (action.error?.message) {
            errorMessage = action.error.message;
          }
          
          state.error = errorMessage;
          state.isInitialized = true;
        }
      )

      // Check auth cases
      .addMatcher(
        authApi.endpoints.checkAuth.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApi.endpoints.checkAuth.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          let userData = null;
          if (action.payload.data) {
            userData = action.payload.data;
          } else if (action.payload.user) {
            userData = action.payload.user;
          } else if (action.payload) {
            userData = action.payload;
          }

          if (userData) {
            state.user = normalizeUserData(userData);
            state.isAuthenticated = true;
          } else {
            state.user = null;
            state.isAuthenticated = false;
          }

          state.error = null;
          state.isInitialized = true;
          state.lastAuthCheck = Date.now();
        }
      )
      .addMatcher(
        authApi.endpoints.checkAuth.matchRejected,
        (state, action) => {
          state.isLoading = false;
          // Surface a friendly message when /me fails (e.g., 500)
          const payloadMessage = (action.payload as any)?.data?.message;
          const fallbackMessage = action.error?.message;
          state.error = payloadMessage || fallbackMessage || 'Failed to verify session. Please try again.';
          state.isInitialized = true;
        }
      )

      // Logout cases
      .addMatcher(
        authApi.endpoints.logout.matchPending,
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        authApi.endpoints.logout.matchFulfilled,
        (state) => {
          state.isLoading = false;
          resetAuthState(state);
        }
      )
      .addMatcher(
        authApi.endpoints.logout.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message || 'Logout failed';
        }
      )

      // Change password cases
      .addMatcher(
        authApi.endpoints.changePassword.matchPending,
        (state) => {
          state.changePasswordLoading = true;
          state.changePasswordError = null;
          state.changePasswordSuccess = null;
        }
      )
      .addMatcher(
        authApi.endpoints.changePassword.matchFulfilled,
        (state, action) => {
          state.changePasswordLoading = false;
          const response = action.payload;
          
          if (response.success) {
            state.changePasswordSuccess = response.message || 'Password updated successfully';
            state.changePasswordError = null;
          } else {
            state.changePasswordError = response.message || 'Failed to change password';
            state.changePasswordSuccess = null;
          }
        }
      )
      .addMatcher(
        authApi.endpoints.changePassword.matchRejected,
        (state, action) => {
          state.changePasswordLoading = false;
          state.changePasswordSuccess = null;
          
          let errorMessage = 'Failed to change password';
          if (action.payload?.data?.message) {
            errorMessage = action.payload.data.message;
          } else if (action.error?.message) {
            errorMessage = action.error.message;
          }
          
          state.changePasswordError = errorMessage;
        }
      );
  },
});

export const { clearError, clearAuth, initializeFromToken, updateUserProfile, clearChangePasswordState } = authSlice.actions;
export default authSlice.reducer;
