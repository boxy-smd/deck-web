import { useContext } from 'react'

import { AuthenticatedStudentContext } from '@/contexts/authenticated-student-context'

export function useAuthenticatedStudent() {
  const context = useContext(AuthenticatedStudentContext)

  if (!context) {
    throw new Error(
      'useAuthenticatedStudent must be used within a AuthenticatedStudentProvider',
    )
  }

  return context
}
