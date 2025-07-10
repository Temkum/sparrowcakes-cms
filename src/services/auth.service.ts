import axios from 'axios';
import axiosInstance from './axiosInstance';

// Define types for auth responses
interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface FirebaseLoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

// import from .env file since I'm using vite
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const login = async (data: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      '/auth/login',
      data
    );
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    const response = await axiosInstance.post<RegisterResponse>(
      '/auth/register',
      {
        name,
        email,
        password,
      }
    );

    if (!response) {
      throw new Error('No response from server');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Get the specific error message from the backend
      const errorMessage =
        error.response?.data?.message || 'Registration failed';
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const firebaseLogin = async (
  idToken: string
): Promise<FirebaseLoginResponse> => {
  try {
    const response = await axiosInstance.post<FirebaseLoginResponse>(
      '/firebase',
      { idToken }
    );
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Firebase login error:', error);
    throw error;
  }
};

export const googleLogin = () => {
  // For redirects, we need the full URL from the axiosInstance baseURL
  const baseURL = axiosInstance.defaults.baseURL || '';
  window.location.href = `${baseURL}/google`;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('auth-storage');
  window.location.href = `${BASE_URL}/login`;
};

export const getToken = () => {
  // First try to get from localStorage directly
  const token = localStorage.getItem('token');
  if (token) return token;

  // If not found, try to get from auth-storage (Zustand persisted state)
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.token || null;
    } catch (error) {
      console.error('Error parsing auth storage:', error);
      return null;
    }
  }

  return null;
};
