import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getToken, login, logout, register } from '../services/auth.service';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

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
          if (response.data) {
            toast.success('Registration successful! Redirecting to login...');
            set({ loading: false });
            return true;
          }
          set({ loading: false });
          return false;
        } catch (error) {
          set({ loading: false });
          toast.error('Registration failed. Please try again.', {
            position: 'bottom-center',
          });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      loginUser: async (email, password) => {
        set({ loading: true });
        try {
          const response = await login({ email, password });
          set({ token: response.token, isAuthenticated: true });
          return true;
        } catch (error) {
          set({ loading: false });
          console.error(error);
          toast.error('Invalid Credentials. Please try again.', {
            position: 'bottom-center',
          });
          throw new Error('Invalid Credentials!');
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
