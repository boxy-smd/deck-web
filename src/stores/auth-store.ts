import { create } from 'zustand'
import type { Profile } from '@/entities/profile'

interface AuthState {
  user: Profile | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: Error | null
  setUser: (user: Profile | null) => void
  setToken: (token: string | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: Error | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  setUser: user => set({ user, isAuthenticated: !!user, isLoading: false }),
  setToken: token => set({ token }),
  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error, isLoading: false }),
  logout: () =>
    set({ user: null, token: null, isAuthenticated: false, error: null }),
}))
