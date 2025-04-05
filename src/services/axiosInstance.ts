import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach token to each request
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired token (401)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const navigate = useNavigate();
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore.getState();
      authStore.logoutUser();
      // window.location.href = '/login';

      toast.error('Session expired. Please log in again.', {
        position: 'bottom-center',
      });
      navigate('/login');
    }
    if (error.response && error.response.status === 403) {
      toast.error('You do not have permission to perform this action.', {
        position: 'bottom-center',
      });
    }
    if (error.response && error.response.status === 500) {
      toast.error('Internal server error. Please try again later.', {
        position: 'bottom-center',
      });
    }
    if (error.response && error.response.status === 400) {
      toast.error('Bad request. Please check your input.', {
        position: 'bottom-center',
      });
    }
    if (error.response && error.response.status === 404) {
      toast.error('Resource not found. Please check the URL.', {
        position: 'bottom-center',
      });
    }
    if (error.response && error.response.status === 409) {
      toast.error('Conflict error. Please check your input.', {
        position: 'bottom-center',
      });
    }
    if (error.response && error.response.status === 422) {
      toast.error('Validation error. Please check your input.', {
        position: 'bottom-center',
      });
    }
    if (error.response && error.response.status === 429) {
      toast.error('Too many requests. Please try again later.', {
        position: 'bottom-center',
      });
    }
    if (error.response && error.response.status === 503) {
      toast.error('Service unavailable. Please try again later.', {
        position: 'bottom-center',
      });
    }
    if (error.response && error.response.status === 504) {
      toast.error('Gateway timeout. Please try again later.', {
        position: 'bottom-center',
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
