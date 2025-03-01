import axios from 'axios';

// import from .env file since I'm using vite
const API_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const login = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/auth/login`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('Login successful:', response.data);
  localStorage.setItem('token', response.data.token);

  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    email,
    password,
  });
  return response.data;
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
  window.location.href = `${BASE_URL}/login`;
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};
