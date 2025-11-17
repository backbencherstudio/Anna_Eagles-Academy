import axios from 'axios';
import { startUpload, setUploadProgress, finishUpload, errorUpload } from '@/rtk/slices/admin/uploadProgressSlice';
import { handleLogout } from './logoutUtils';

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    const shouldUseProxy = process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PUBLIC_API_ENDPOINT?.includes('backend.thewhiteeaglesacademy.com');
    return shouldUseProxy ? '' : (process.env.NEXT_PUBLIC_API_ENDPOINT || '');
  }
  return process.env.NEXT_PUBLIC_API_ENDPOINT || '';
};

const axiosClient = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 60000, // Default 60 seconds timeout
});


// get cookie
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

axiosClient.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Common base
export const createBaseQuery = () => {
  return async (args: { url: string; method: string; data?: any; params?: any }, api?: any) => {
    try {
      const { url, method, data, params } = args;

      let response;
      switch (method.toUpperCase()) {
        case 'GET':
          response = await axiosClient.get(url, { params });
          break;
        case 'POST':
          // Skip auto progress tracking for chunk uploads (handled manually)
          const isChunkUpload = url.includes('/upload/chunk') && !url.includes('/merge') && !url.includes('/abort');
          // Extended timeout for chunk uploads (5 minutes per chunk)
          const chunkUploadTimeout = isChunkUpload ? 300000 : undefined; // 5 minutes for chunk uploads
          
          if (typeof FormData !== 'undefined' && data instanceof FormData && !isChunkUpload) {
            api?.dispatch?.(startUpload());
          }
          response = await axiosClient.post(url, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            timeout: chunkUploadTimeout,
            onUploadProgress: (progressEvent) => {
              if (!progressEvent.total || isChunkUpload) return;
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              api?.dispatch?.(setUploadProgress(percent));
            },
          });
          break;
        case 'PATCH':
          if (typeof FormData !== 'undefined' && data instanceof FormData) {
            api?.dispatch?.(startUpload());
          }
          response = await axiosClient.patch(url, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              if (!progressEvent.total) return;
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              api?.dispatch?.(setUploadProgress(percent));
            },
          });
          break;
        case 'DELETE':
          response = await axiosClient.delete(url);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      // mark success when uploading FormData (skip for chunk uploads)
      const isChunkUpload = args.url?.includes('/upload/chunk') && !args.url?.includes('/merge') && !args.url?.includes('/abort');
      if (typeof FormData !== 'undefined' && (args.data instanceof FormData) && !isChunkUpload) {
        api?.dispatch?.(finishUpload());
      }

      return { data: response.data };
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 401) {
        // Only call handleLogout if token exists (user is still logged in)
        // If token doesn't exist, we're already logged out, so don't call handleLogout again
        const token = getCookie('token');
        if (token) {
          handleLogout(api);
        }
      }
      // mark error only if was uploading
      try {
        const isMultipart = typeof FormData !== 'undefined' && (args.data instanceof FormData);
        if (isMultipart) {
          api?.dispatch?.(errorUpload(error?.message));
        }
      } catch (_) { }
      return {
        error: {
          status,
          data: error.response?.data || error.message,
        },
      };
    }
  };
};

// Special base query for auth API (handles JSON data instead of FormData)
export const createAuthBaseQuery = () => {
  return async (args: any, api: any, extraOptions: any) => {
    try {
      const { url, method = 'GET', body, params, headers } = args;

      // Prevent /api/auth/me request if there's no token (already logged out)
      if (url === '/api/auth/me' || url.includes('/api/auth/me')) {
        const token = getCookie('token');
        if (!token) {
          // Return error without making the request
          return {
            error: {
              status: 401,
              data: 'Unauthorized - No token found',
            },
          };
        }
      }

      // Extended timeout for merge operation (1 hour for large video files)
      const isMergeOperation = url.includes('/upload/chunk/merge');
      const timeout = isMergeOperation ? 3600000 : 60000; // 60 minutes (1 hour) for merge, 60 seconds default

      // For merge operations, bypass Next.js proxy and use direct backend URL
      // This avoids Next.js proxy timeout (30-60s) which causes ECONNRESET errors
      let clientToUse = axiosClient;
      if (isMergeOperation && typeof window !== 'undefined') {
        const backendUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || '';
        if (backendUrl) {
          // Create a separate axios instance with direct backend URL (bypasses proxy)
          clientToUse = axios.create({
            baseURL: backendUrl,
            withCredentials: true,
            timeout: 60000, // Default timeout for client creation
          });

          // Add auth token interceptor
          const token = getCookie('token');
          if (token) {
            clientToUse.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }

          // Add request interceptor for token
          clientToUse.interceptors.request.use(
            (config) => {
              const currentToken = getCookie('token');
              if (currentToken) {
                config.headers.Authorization = `Bearer ${currentToken}`;
              }
              return config;
            },
            (error) => {
              return Promise.reject(error);
            }
          );
        }
      }

      // Retry logic for merge operations (only retry on connection errors)
      const maxRetries = isMergeOperation ? 3 : 1;
      let lastError: any = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          let response;
          const requestConfig = {
            headers,
            withCredentials: true,
            timeout,
            // Add signal for potential cancellation
            signal: extraOptions?.signal,
          };

          switch (method.toUpperCase()) {
            case 'POST':
              response = await clientToUse.post(url, body, requestConfig);
              break;
            case 'GET':
              response = await clientToUse.get(url, { ...requestConfig, params });
              break;
            case 'PATCH':
              response = await clientToUse.patch(url, body, requestConfig);
              break;
            case 'DELETE':
              response = await clientToUse.delete(url, { ...requestConfig, params });
              break;
            default:
              response = await clientToUse.get(url, { ...requestConfig, params });
          }

          return { data: response.data };
        } catch (error: any) {
          lastError = error;
          
          // Only retry on connection errors (ECONNRESET, ETIMEDOUT, etc.)
          const isConnectionError = 
            error.code === 'ECONNRESET' || 
            error.code === 'ETIMEDOUT' || 
            error.code === 'ECONNREFUSED' ||
            error.message?.includes('socket hang up') ||
            error.message?.includes('timeout');

          // Don't retry on last attempt or if it's not a connection error
          if (attempt < maxRetries - 1 && isConnectionError && isMergeOperation) {
            // Wait before retrying (exponential backoff)
            const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          // If it's not a connection error or last attempt, break and handle error
          break;
        }
      }

      // Handle error after all retries
      const status = lastError?.response?.status || 500;
      if (status === 401) {
        // Only call handleLogout if token exists (user is still logged in)
        // If token doesn't exist, we're already logged out, so don't call handleLogout again
        const token = getCookie('token');
        if (token) {
          handleLogout(api);
        }
      }

      // Provide more helpful error message for connection errors
      let errorMessage = lastError?.response?.data || lastError?.message || 'An error occurred';
      if (lastError?.code === 'ECONNRESET' || lastError?.message?.includes('socket hang up')) {
        errorMessage = isMergeOperation 
          ? 'Connection lost while merging video. Please try again. If the problem persists, the video may be too large.'
          : 'Connection lost. Please try again.';
      }

      return {
        error: {
          status,
          data: errorMessage,
        },
      };
    } catch (error: any) {
      const status = error.response?.status || 500;
      if (status === 401) {
        const token = getCookie('token');
        if (token) {
          handleLogout(api);
        }
      }
      return {
        error: {
          status,
          data: error.response?.data || error.message || 'An error occurred',
        },
      };
    }
  };
};

export default axiosClient;
