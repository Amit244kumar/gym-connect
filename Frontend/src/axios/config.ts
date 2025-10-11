import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

interface configType{
    baseURL:string;
    headers:object
    keepalive:boolean
}
export const config:configType={
    baseURL:'http://localhost:5000',
    keepalive: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'X-Requested-With': 'XMLHttpRequest',
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

export default api;