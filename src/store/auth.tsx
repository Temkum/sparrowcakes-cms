import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  login,
  logout,
  isAuthenticated,
  getToken,
} from '../services/auth.service';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: getToken(),
      isAuthenticated: isAuthenticated(),
      loginUser: async (email, password) => {
        try {
          const response = await login({ email, password });
          set({ token: response.token, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },
      logoutUser: () => {
        logout();
        set({ token: null, isAuthenticated: false });
      },
      checkAuth: () => {
        const token = getToken();
        set({ token, isAuthenticated: isAuthenticated() });
      },
    }),
    {
      name: 'auth-storage', // Persist in localStorage
    }
  )
);
