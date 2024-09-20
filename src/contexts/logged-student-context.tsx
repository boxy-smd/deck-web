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
  setStudentDetails: (details: Profile) => void
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
  const [student, setStudent] = useState<Profile | undefined>(undefined)

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

  const { data, refetch } = useQuery({
    queryKey: ['student', 'details'],
    queryFn: getStudent,
    enabled: Boolean(token),
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  })

  const refreshStudent = useCallback(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    const storedToken = localStorage.getItem('token')

    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  useEffect(() => {
    if (token) {
      refreshStudent()
    }
  }, [token, refreshStudent])

  useEffect(() => {
    if (data) {
      setStudent(data)
    }
  }, [data])

  async function handleLogout() {
    localStorage.removeItem('token')
    await queryClient.invalidateQueries({
      queryKey: ['student', 'details'],
    })
    setToken(undefined)
    setStudent(undefined)
  }

  function setStudentDetails(details: Profile) {
    setStudent(details)
  }

  return (
    <LoggedStudentContext.Provider
      value={{
        token,
        student,
        handleLogout,
        setStudentDetails,
      }}
    >
      {children}
    </LoggedStudentContext.Provider>
  )
}
