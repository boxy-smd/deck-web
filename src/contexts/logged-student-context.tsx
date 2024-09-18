'use client'

import type { Student } from '@/entities/profile'
import { useQuery } from '@tanstack/react-query'
import { type ReactNode, createContext, useCallback } from 'react'

type LoggedStudentProps = {
  student: Student | undefined
}

export const LoggedStudentContext = createContext<LoggedStudentProps | null>(
  null,
)

interface LoggedStudentProviderProps {
  children: ReactNode
}

export function LoggedStudentProvider({
  children,
}: LoggedStudentProviderProps) {
  const token = localStorage.getItem('token')

  const getStudent = useCallback(async () => {
    if (!token) {
      return
    }

    const response = await fetch('https://deck-api.onrender.com/students/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async response => {
      const data = (await response.json()) as {
        student: Student
      }

      return data.student
    })

    return response
  }, [token])

  const { data: student } = useQuery({
    queryKey: ['student'],
    queryFn: getStudent,
  })

  return (
    <LoggedStudentContext.Provider
      value={{
        student,
      }}
    >
      {children}
    </LoggedStudentContext.Provider>
  )
}
