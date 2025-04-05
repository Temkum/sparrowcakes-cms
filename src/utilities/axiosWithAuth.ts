import axios from 'axios';
import { getToken, logout } from '../services/auth.service';

const axiosWithAuth = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach token to each request
axiosWithAuth.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired token (401)
axiosWithAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is likely expired or invalid
      logout();
      window.location.href = '/login'; // ⛔ You can also use a `navigate()` from router instead
    }
    return Promise.reject(error);
  }
);

export default axiosWithAuth;
