import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  login,
  logout,
  isAuthenticated,
  getToken,
  register,
} from '../services/auth.service';
import toast from 'react-hot-toast';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  registerUser: (
    name: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: getToken(),
      isAuthenticated: isAuthenticated(),

      registerUser: async (name, email, password) => {
        try {
          const response = await register(name, email, password);
          if (response.data) {
            toast.success('Registration successful! Redirecting to login...');
            return true; // Ensure it returns true when successful
          }

          return false;
        } catch (error) {
          toast.error('Registration failed. Please try again.', {
            position: 'bottom-center',
          });
          throw error;
        }
      },

      loginUser: async (email, password) => {
        try {
          const response = await login({ email, password });
          set({ token: response.token, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Invalid credentials:', error);
          toast.error('Invalid Credentials. Please try again.', {
            position: 'bottom-center',
          });
          throw new Error('Invalid Credentials!');
        }
      },

      logoutUser: () => {
        logout();
        localStorage.removeItem('token');
        set({ token: null, isAuthenticated: false });
      },

      checkAuth: () => {
        const token = getToken();
        set({ token, isAuthenticated: isAuthenticated() });
      },
    }),
    {
      name: 'auth-storage', // Persists authentication state in localStorage
    }
  )
);
