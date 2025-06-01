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
    const response = await axiosInstance.post<object, LoginResponse>(
      '/auth/login',
      data
    );
    console.log(response);
    return response;
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
    const response = await axiosInstance.post<object, RegisterResponse>(
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

    return response;
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
    const response = await axiosInstance.post<object, FirebaseLoginResponse>(
      '/firebase',
      { idToken }
    );
    localStorage.setItem('token', response.token);
    return response;
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
  const token = localStorage.getItem('auth-storage');
  return token;
};
