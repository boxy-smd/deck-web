import { useContext } from 'react'

import { LoggedStudentContext } from '../logged-student-context'

export function useLoggedStudent() {
  const context = useContext(LoggedStudentContext)

  if (!context) {
    throw new Error(
      'useLoggedStudent must be used within a LoggedStudentProvider',
    )
  }

  return context
}
