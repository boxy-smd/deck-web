import { useTagsStore } from '@/stores/tags-store'

export function useTagsDependencies() {
  const { trails, professors, subjects, isLoading, error } = useTagsStore()

  return {
    trails: {
      data: trails,
      isLoading,
      error,
    },
    professors: {
      data: professors,
      isLoading,
      error,
    },
    subjects: {
      data: subjects,
      isLoading,
      error,
    },
  }
}
