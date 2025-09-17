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

      let errorMessage = 'Login failed';

      if (error.response?.data?.message?.message) {

        errorMessage = error.response.data.message.message;
      } else if (error.response?.data?.message) {

        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return rejectWithValue(errorMessage);
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
      let errorMessage = 'Authentication check failed';

      if (error.response?.data?.message?.message) {
        errorMessage = error.response.data.message.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return rejectWithValue(errorMessage);
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
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
      state.isInitialized = true;
      state.lastAuthCheck = null;
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
        state.isAuthenticated = true;
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
          state.user = {
            id: userData.id || userData._id || 'unknown',
            name: userData.name || userData.username || userData.fullName || 'User',
            email: userData.email || userData.emailAddress || 'unknown@example.com',
            role: (userData.type === 'admin' || userData.role === 'admin') ? 'admin' : 'user',
            avatar: userData.avatar || userData.profileImage || userData.image || undefined,
            createdAt: userData.created_at || userData.createdAt || userData.created || new Date().toISOString(),
            updatedAt: userData.updated_at || userData.updatedAt || userData.updated || new Date().toISOString()
          };
        } else {
          // Create default user object if not provided in either response
          state.user = {
            id: 'temp-id',
            name: 'User',
            email: 'user@example.com',
            role: loginPayload?.type === 'admin' ? 'admin' : 'user',
            avatar: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
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
          state.user = {
            id: userData.id || userData._id || 'unknown',
            name: userData.name || userData.username || userData.fullName || 'User',
            email: userData.email || userData.emailAddress || 'unknown@example.com',
            role: (userData.type === 'admin' || userData.role === 'admin') ? 'admin' : 'user',
            avatar: userData.avatar || userData.profileImage || userData.image || undefined,
            createdAt: userData.created_at || userData.createdAt || userData.created || new Date().toISOString(),
            updatedAt: userData.updated_at || userData.updatedAt || userData.updated || new Date().toISOString()
          };
        } else {

          state.user = {
            id: 'unknown',
            name: 'User',
            email: 'unknown@example.com',
            role: 'user',
            avatar: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
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
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
