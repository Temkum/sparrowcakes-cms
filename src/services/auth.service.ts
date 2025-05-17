import axios from 'axios';
import axiosInstance from './axiosInstance';

// import from .env file since I'm using vite
const API_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const login = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/auth/login`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });

    if (!response) {
      throw new Error('No response from server');
    }

    // Check if the response data contains an error message
    if (response.data && response.data.error) {
      throw new Error(response.data.error);
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

export const firebaseLogin = async (idToken: string) => {
  const response = await axios.post(`${API_URL}/firebase`, { idToken });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const googleLogin = () => {
  window.location.href = `${API_URL}/google`;
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
