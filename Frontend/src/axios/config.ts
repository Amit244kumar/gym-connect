import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

interface configType{
    baseURL:string;
    timeout: number,
    headers:object
}
const config:configType={
    baseURL:'http://localhost:5000',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
}

// Create axios instance
const api: AxiosInstance = axios.create(config);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('gymOwnerToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
// api.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem('gymOwnerToken');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

  export default api;