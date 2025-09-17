import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('Axios interceptor caught error:', error);
    console.log('Error response data:', error.response?.data);
    return Promise.reject(error);
  }
);

export default axiosClient;
