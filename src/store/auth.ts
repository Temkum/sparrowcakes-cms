import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getToken, login, logout, register } from '../services/auth.service';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface AuthStoreState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthStoreActions {
  registerUser: (
    name: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  checkAuth: () => Promise<void>;
  init: () => () => void;
}

type AuthStore = AuthStoreState & AuthStoreActions;

const tokenExpirationInterval = 1000 * 60 * 30;

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const useAuthStore: () => AuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: getToken(),
      isAuthenticated: false,
      loading: false,

      registerUser: async (name, email, password) => {
        set({ loading: true });
        try {
          const response = await register(name, email, password);
          console.log('reg response', response);
          if (response?.data) {
            set({ loading: false });
            return true;
          }
          throw new Error('Registration failed');
        } catch (error) {
          set({ loading: false });
          if (axios.isAxiosError(error)) {
            const message =
              error.response?.data?.message || 'Registration failed';
            if (message.includes('duplicate')) {
              throw new Error('This email is already registered');
            } else if (message.includes('database')) {
              throw new Error('Server error. Please try again later');
            }
            throw new Error(message);
          }
          throw error;
        }
      },

      loginUser: async (email, password) => {
        set({ loading: true });
        try {
          const response = await login({ email, password });
          set({ token: response.token, isAuthenticated: true });
          return true;
        } catch (error: any) {
          set({ loading: false });
          const errorMessage =
            error.response?.data?.message || 'Invalid email or password';
          toast.error(errorMessage, {
            position: 'bottom-center',
          });
          throw new Error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      logoutUser: () => {
        logout();
        set({ token: null, isAuthenticated: false });
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        toast.success('Logged out successfully!', {
          position: 'bottom-center',
        });
        window.location.href = '/login';
      },

      checkAuth: async () => {
        set({ loading: true });
        const token = get().token;
        if (token && !isTokenExpired(token)) {
          set({ token, isAuthenticated: true });
        } else {
          set({ token: null, isAuthenticated: false });
          logout();
          window.location.href = '/login';
        }
        set({ loading: false });
      },

      init: () => {
        const interval = setInterval(() => {
          const token = get().token;
          if (!token || isTokenExpired(token)) {
            logout();
            set({ token: null, isAuthenticated: false });
            window.location.href = '/login';
          }
        }, tokenExpirationInterval);

        return () => clearInterval(interval);
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
