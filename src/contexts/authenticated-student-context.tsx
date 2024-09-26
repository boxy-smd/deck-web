'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { type ReactNode, createContext, useCallback } from 'react'

import type { Profile } from '@/entities/profile'
import { instance } from '@/lib/axios'

interface AuthenticatedStudentContextProps {
  student: UseQueryResult<Profile, Error>
}

export const AuthenticatedStudentContext =
  createContext<AuthenticatedStudentContextProps | null>(null)

interface AuthenticatedStudentProvidesProps {
  children: ReactNode
}

export function AuthenticatedStudentProvider({
  children,
}: AuthenticatedStudentProvidesProps) {
  const { data: session } = useSession()

  const getStudentDetails = useCallback(async () => {
    instance.defaults.headers.common.Authorization = `Bearer ${session?.token}`

    const { data } = await instance.get<{
      details: Profile
    }>('/students/me')

    return data.details
  }, [session])

  const student = useQuery({
    queryKey: ['students', 'me'],
    queryFn: getStudentDetails,
    enabled: Boolean(session),
  })

  return (
    <AuthenticatedStudentContext.Provider
      value={{
        student,
      }}
    >
      {children}
    </AuthenticatedStudentContext.Provider>
  )
}
