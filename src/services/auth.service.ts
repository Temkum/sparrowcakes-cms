import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

// Import environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

// decode a JWT token
function decodeToken(token: string) {
  try {
    return jwtDecode<{ exp: number }>(token); // Decode the token and extract expiration time
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// check if a token is expired
function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true; // Token is invalid or missing expiration
  }
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  return decoded.exp < currentTime; // Check if expiration time is in the past
}

export const login = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/auth/login`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  localStorage.setItem('token', response.data.token);

  return response.data;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    name,
    email,
    password,
  });

  return response.data;
};

// Firebase login function
export const firebaseLogin = async (idToken: string) => {
  const response = await axios.post(`${API_URL}/firebase`, { idToken });
  localStorage.setItem('token', response.data.token);

  return response.data;
};

// google login
export const googleLogin = () => {
  window.location.href = `${API_URL}/google`;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = `${BASE_URL}/login`;
};

// check if the user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return false; // No token found
  }
  return !isTokenExpired(token); // Check if the token is still valid
};

// get the current token
export const getToken = () => {
  return localStorage.getItem('token');
};

// refresh the token (if supported by your backend)
export const refreshToken = async () => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    console.warn('Token is expired or missing. Redirecting to login...');
    logout(); // Redirect to login if the token is expired
    return null;
  }

  try {
    // Replace this endpoint with your actual token refresh endpoint
    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
      token,
    });
    const newToken = response.data.token;
    localStorage.setItem('token', newToken); // Update the token in storage
    console.log('Token refreshed successfully:', newToken);
    return newToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    logout(); // Redirect to login on failure
    return null;
  }
};

export const sendPasswordReset = async (email: string) => {
  await axios.post(`${API_URL}/auth/forgot-password`, { email });
};

export const resetPassword = async (data: FormData) => {
  try {
    await axios.post(`${API_URL}/auth/reset-password`, data);
  } catch (error) {
    console.error('Password reset failed:', error);
  }
};
