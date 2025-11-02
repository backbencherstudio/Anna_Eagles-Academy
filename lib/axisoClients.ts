import axios from 'axios';
import { startUpload, setUploadProgress, finishUpload, errorUpload } from '@/rtk/slices/admin/uploadProgressSlice';
import { handleLogout } from './logoutUtils';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  withCredentials: true, // This allows cookies to be sent/received in cross-origin requests
});

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

// Common base query for APIs that handle FormData (materials, courses)
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
          // Dispatch start upload if payload is FormData (file upload)
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
        handleLogout(api);
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
        handleLogout(api);
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
