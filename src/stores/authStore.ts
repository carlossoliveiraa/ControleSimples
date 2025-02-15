import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: any | null;
  setUser: (user: any) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      user: null,
      setUser: (user) => set({ user })
    }),
    {
      name: 'auth-storage'
    }
  )
); 