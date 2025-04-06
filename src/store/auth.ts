import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login, logout, register } from '../services/auth.service';
import toast from 'react-hot-toast';

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
}

type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
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
        }
      },

      loginUser: async (email, password) => {
        set({ loading: true });
        try {
          const response = await login({ email, password });
          set({
            token: response.token,
            isAuthenticated: true,
            loading: false,
          });
          return true;
        } catch (error) {
          set({ loading: false });
          console.error('Login error:', error);

          toast.error('Invalid Credentials. Please try again.', {
            position: 'bottom-center',
          });
          throw new Error('Invalid Credentials!');
        }
      },

      logoutUser: () => {
        logout();
        set({
          token: null,
          isAuthenticated: false,
          loading: false,
        });
        // persist middleware handles storage cleanup automatically
      },

      checkAuth: async () => {
        set({ loading: true });
        const currentToken = get().token;
        set({
          isAuthenticated: !!currentToken,
          loading: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      // Optional: you can blacklist certain properties from being persisted
      // partialize: (state) => ({ ...state, loading: false })
    }
  )
);
