import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
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
  return async (args: { url: string; method: string; data?: any; params?: any }) => {
    try {
      const { url, method, data, params } = args;

      let response;
      switch (method.toUpperCase()) {
        case 'GET':
          response = await axiosClient.get(url, { params });
          break;
        case 'POST':
          response = await axiosClient.post(url, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          break;
        case 'PATCH':
          response = await axiosClient.patch(url, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          break;
        case 'DELETE':
          response = await axiosClient.delete(url);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return { data: response.data };
    } catch (error: any) {
      return {
        error: {
          status: error.response?.status,
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
      const { url, method = 'GET', body, ...rest } = args;
      
      let response;
      switch (method) {
        case 'POST':
          response = await axiosClient.post(url, body);
          break;
        case 'GET':
          response = await axiosClient.get(url);
          break;
        case 'PATCH':
          response = await axiosClient.patch(url, body);
          break;
        case 'DELETE':
          response = await axiosClient.delete(url);
          break;
        default:
          response = await axiosClient.get(url);
      }

      return { data: response.data };
    } catch (error: any) {
      return {
        error: {
          status: error.response?.status || 500,
          data: error.response?.data || error.message || 'An error occurred',
        },
      };
    }
  };
};

export default axiosClient;
