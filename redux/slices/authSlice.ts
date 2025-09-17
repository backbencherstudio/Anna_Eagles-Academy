import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login, authCheckMe } from '@/lib/apis/authApis';

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

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  lastAuthCheck: number | null;
}

// Normalize any backend/user shape into our User type
function normalizeUserData(input: any): User {
  return {
    id: input?.id || input?._id || 'unknown',
    name: input?.name || input?.username || input?.fullName || 'User',
    email: input?.email || input?.emailAddress || 'unknown@example.com',
    role: (input?.type === 'admin' || input?.role === 'admin') ? 'admin' : 'user',
    avatar: input?.avatar || input?.profileImage || input?.image || undefined,
    createdAt: input?.created_at || input?.createdAt || input?.created || new Date().toISOString(),
    updatedAt: input?.updated_at || input?.updatedAt || input?.updated || new Date().toISOString(),
    date_of_birth: input?.date_of_birth || input?.dateOfBirth || undefined,
    phone_number: input?.phone_number || input?.phoneNumber || undefined,
    gender: input?.gender || undefined,
    address: input?.address || undefined,
    type: input?.type || undefined,
  };
}

// Normalize various error response shapes into a single message
function normalizeErrorMessage(error: any): string {
  if (error?.response?.data?.message?.message) return error.response.data.message.message;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.message) return error.message;
  return 'Unexpected error';
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

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await login(credentials);


      const token = response.token ||
        response.data?.token ||
        response.authorization?.token ||
        response.data?.authorization?.token;

      // Set token in cookie
      if (typeof document !== 'undefined' && token) {
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
      }

      let meResponse: any = null;
      try {
        meResponse = await authCheckMe();
      } catch (_) {

      }

      return { login: response, me: meResponse } as any;
    } catch (error: any) {
      return rejectWithValue(normalizeErrorMessage(error) || 'Login failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const now = Date.now();
      const lastCheck = state.auth.lastAuthCheck || 0;
      const fiveMinutes = 5 * 60 * 1000;

      if (state.auth.user && state.auth.isAuthenticated && (now - lastCheck) < fiveMinutes) {
        return { user: state.auth.user, fromCache: true };
      }

      const response = await authCheckMe();
      return response;
    } catch (error: any) {
      return rejectWithValue(normalizeErrorMessage(error) || 'Authentication check failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      if (typeof document !== 'undefined') {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }

      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }

      return true;
    } catch (error: any) {
      return rejectWithValue('Logout failed');
    }
  }
);

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
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const loginPayload = action.payload?.login ?? action.payload;
        const mePayload = action.payload?.me;

        // Handle different token structures
        state.token = loginPayload?.token ||
          loginPayload?.data?.token ||
          loginPayload?.authorization?.token ||
          loginPayload?.data?.authorization?.token || null;

        // Prefer user data from /me
        let userData = mePayload?.data ?? mePayload?.user ?? mePayload;
        if (!userData) {
          // Fallback to possible user in login response
          userData = loginPayload?.user ?? loginPayload?.data?.user ?? null;
        }

        if (userData) {
          state.user = normalizeUserData(userData);
          state.isAuthenticated = true;
        } else {
          // Do not create a placeholder user; keep it null until real data arrives
          state.user = null;
          state.isAuthenticated = Boolean(state.token);
        }

        state.error = null;
        state.isInitialized = true;
        state.lastAuthCheck = Date.now();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
        state.isInitialized = true;
      })

      // Check auth cases
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;

        // If this is from cache, don't update user data
        if (action.payload.fromCache) {
          state.error = null;
          state.isInitialized = true;
          return;
        }


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
          // Keep user null instead of fabricating a placeholder
          state.user = null;
          state.isAuthenticated = false;
        }

        state.error = null;
        state.isInitialized = true;
        state.lastAuthCheck = Date.now();
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
        state.isInitialized = true;
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        resetAuthState(state);
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
