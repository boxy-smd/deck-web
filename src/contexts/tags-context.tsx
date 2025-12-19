'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { createContext, type ReactNode, useCallback } from 'react'
import type { Professor } from '@/entities/professor'
import type { Subject } from '@/entities/subject'
import type { Trail } from '@/entities/trail'
import { instance } from '@/lib/axios'

interface TagsContextProps {
  trails: UseQueryResult<Trail[], Error>
  professors: UseQueryResult<Professor[], Error>
  subjects: UseQueryResult<Subject[], Error>
}

export const TagsContext = createContext<TagsContextProps | null>(null)

interface TagsProvidesProps {
  children: ReactNode
}

export function TagsProvider({ children }: TagsProvidesProps) {
  const fetchTrails = useCallback(async () => {
    const { data } = await instance.get<{
      trails: Trail[]
    }>('/trails')

    return data.trails
  }, [])

  const fetchProfessors = useCallback(async () => {
    const { data } = await instance.get<{
      professors: Professor[]
    }>('/professors')

    return data.professors
  }, [])

  const fetchSubjects = useCallback(async () => {
    const { data } = await instance.get<{
      subjects: Subject[]
    }>('/subjects')

    return data.subjects
  }, [])

  const trails = useQuery<Trail[]>({
    queryKey: ['trails'],
    queryFn: fetchTrails,
  })

  const professors = useQuery<Professor[]>({
    queryKey: ['professors'],
    queryFn: fetchProfessors,
  })

  const subjects = useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
  })

  return (
    <TagsContext.Provider
      value={{
        trails,
        professors,
        subjects,
      }}
    >
      {children}
    </TagsContext.Provider>
  )
}
