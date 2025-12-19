import { useAuthStore } from '@/stores/auth-store'

export function useAuthenticatedStudent() {
  const { user, isLoading, error } = useAuthStore()

  return {
    student: {
      data: user,
      isLoading,
      error,
    },
  }
}
