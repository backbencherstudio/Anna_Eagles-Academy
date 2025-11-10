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
          if (typeof FormData !== 'undefined' && data instanceof FormData) {
            api?.dispatch?.(startUpload());
          }
          response = await axiosClient.post(url, data, {
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

      // mark success when uploading FormData
      if (typeof FormData !== 'undefined' && (args.data instanceof FormData)) {
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

      let response;
      switch (method.toUpperCase()) {
        case 'POST':
          response = await axiosClient.post(url, body, { headers, withCredentials: true });
          break;
        case 'GET':
          response = await axiosClient.get(url, { params, headers, withCredentials: true });
          break;
        case 'PATCH':
          response = await axiosClient.patch(url, body, { headers, withCredentials: true });
          break;
        case 'DELETE':
          response = await axiosClient.delete(url, { params, headers, withCredentials: true });
          break;
        default:
          response = await axiosClient.get(url, { params, headers, withCredentials: true });
      }

      return { data: response.data };
    } catch (error: any) {
      const status = error.response?.status || 500;
      if (status === 401) {
        // Only call handleLogout if token exists (user is still logged in)
        // If token doesn't exist, we're already logged out, so don't call handleLogout again
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
