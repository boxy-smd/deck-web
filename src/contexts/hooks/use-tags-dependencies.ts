import { useContext } from 'react'

import { TagsContext } from '@/contexts/tags-context'

export function useTagsDependencies() {
  const context = useContext(TagsContext)

  if (!context) {
    throw new Error('useTagsDependencies must be used within a TagsProvider')
  }

  return context
}
