import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

interface configType{
    baseURL:string;
    headers:object
    keepalive:boolean
}
export const config:configType={
    baseURL:'https://circinate-noninherited-whitley.ngrok-free.dev',
    // baseURL:'http://localhost:5000',
    keepalive: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'ngrok-skip-browser-warning': 'true',
    },
}

// Create axios instance
const api: AxiosInstance = axios.create(config);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const ownerToken = localStorage.getItem('gymOwnerToken');
    const memberToken = localStorage.getItem('memberToken');
    const token = ownerToken || memberToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default api;