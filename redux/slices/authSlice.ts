import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi, User } from '@/redux/api/authApi';

// Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  lastAuthCheck: number | null;
}

// Normalize user data from API response
function normalizeUserData(input: any): User {
  return {
    id: input?.id || input?._id || 'unknown',
    name: input?.name || input?.username || 'User',
    email: input?.email || 'unknown@example.com',
    role: (input?.type === 'admin' || input?.role === 'admin') ? 'admin' : 'user',
    avatar: input?.avatar || input?.profileImage || undefined,
    createdAt: input?.created_at || input?.createdAt || new Date().toISOString(),
    updatedAt: input?.updated_at || input?.updatedAt || new Date().toISOString(),
    date_of_birth: input?.date_of_birth || undefined,
    phone_number: input?.phone_number || undefined,
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

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
  lastAuthCheck: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      resetAuthState(state);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.lastAuthCheck = Date.now();
    },
    initializeAuth: (state) => {
      if (state.token && !state.user) {
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
      }
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
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
        (state) => {
          state.isLoading = false;
          state.error = null;
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
      );
  },
});

export const { clearError, setToken, clearAuth, setUser, setLoading, setError, initializeAuth, initializeFromToken } = authSlice.actions;
export default authSlice.reducer;
