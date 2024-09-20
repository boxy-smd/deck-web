'use client'

import { useQuery } from '@tanstack/react-query'
import {
  type ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react'

import type { Profile } from '@/entities/profile'
import { queryClient } from '@/lib/tanstack-query/client'

type LoggedStudentProps = {
  token: string | undefined
  student: Profile | undefined
  handleLogout: () => void
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
  const [token, setToken] = useState<string | undefined>(undefined)
  const hasToken = Boolean(token)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')

    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const getStudent = useCallback(async () => {
    try {
      const response = await fetch(
        'https://deck-api.onrender.com/students/me',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const data = (await response.json()) as {
        details: Profile
      }

      return data.details
    } catch (error) {
      console.error('Failed to fetch student details:', error)
      return undefined
    }
  }, [token])

  const { data: student } = useQuery({
    queryKey: ['student', 'details'],
    queryFn: getStudent,
    enabled: hasToken,
  })

  async function handleLogout() {
    localStorage.removeItem('token')
    await queryClient.invalidateQueries({
      queryKey: ['student', 'details'],
    })
    setToken(undefined)
  }

  return (
    <LoggedStudentContext.Provider
      value={{
        token,
        student,
        handleLogout,
      }}
    >
      {children}
    </LoggedStudentContext.Provider>
  )
}
