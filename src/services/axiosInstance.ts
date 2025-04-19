import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

let authToken = '';
export const setAxiosToken = (token: string) => {
  authToken = token;
};

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Error mapping
const errorMessages: Record<number, string> = {
  400: 'Bad request. Please check your input.',
  401: 'Session expired. Please log in again.',
  403: 'You do not have permission for this action.',
  404: 'Resource not found.',
  409: 'Conflict detected.',
  422: 'Validation error.',
  429: 'Too many requests. Please slow down.',
  500: 'Server error. Please try again later.',
  503: 'Service unavailable.',
  504: 'Gateway timeout.',
  '23505': 'This value already exists. Please choose a different one.',
  '23503': 'Related record not found.',
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      // Handle specific error messages from the server
      if (errorData?.message) {
        toast.error(errorData.message, { position: 'bottom-center' });
        return Promise.reject(new Error(errorData.message));
      }

      // Handle validation errors array
      if (Array.isArray(errorData?.errors)) {
        const messages = errorData.errors.map((e: any) => e.message).join(', ');
        toast.error(messages, { position: 'bottom-center' });
        return Promise.reject(new Error(messages));
      }

      // Fallback to default error messages
      const message = errorMessages[status] || 'An unexpected error occurred';
      toast.error(message, { position: 'bottom-center' });

      if (status === 401) {
        useAuthStore().logoutUser();
        window.location.href = '/login';
      }
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.', {
        position: 'bottom-center',
      });
    } else {
      toast.error('Network error. Please check your connection.', {
        position: 'bottom-center',
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
