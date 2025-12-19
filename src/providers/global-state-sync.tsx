'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import type { Profile } from '@/entities/profile'
import {
  useProfessorsControllerFetchProfessors,
  useSubjectsControllerFetchSubjects,
  useTrailsControllerFetchTrails,
} from '@/http/api'
import { instance } from '@/lib/axios'
import {
  mapProfessorDtoToProfessor,
  mapSubjectDtoToSubject,
  mapTrailDtoToTrail,
} from '@/lib/mappers'
import { useAuthStore } from '@/stores/auth-store'
import { useTagsStore } from '@/stores/tags-store'

interface GlobalStateSyncProps {
  children: ReactNode
}

export function GlobalStateSync({ children }: GlobalStateSyncProps) {
  const { data: session } = useSession()

  const {
    setUser,
    setToken,
    setLoading: setAuthLoading,
    setError: setAuthError,
  } = useAuthStore()

  const {
    setTrails,
    setProfessors,
    setSubjects,
    setLoading: setTagsLoading,
    setError: setTagsError,
  } = useTagsStore()

  const {
    data: profile,
    isLoading: isAuthLoading,
    error: authError,
  } = useQuery({
    queryKey: ['students', 'me'],
    queryFn: async () => {
      if (!session?.token) {
        return null
      }
      instance.defaults.headers.common.Authorization = `Bearer ${session.token}`
      const { data } = await instance.get<{ details: Profile }>('/students/me')
      return data.details
    },
    enabled: !!session?.token,
  })

  useEffect(() => {
    if (session?.token) {
      setToken(session.token)
      instance.defaults.headers.common.Authorization = `Bearer ${session.token}`
    } else {
      setToken(null)
      delete instance.defaults.headers.common.Authorization
    }
  }, [session, setToken])

  useEffect(() => {
    setAuthLoading(isAuthLoading)
    if (profile) {
      setUser(profile)
    }

    if (authError) {
      setAuthError(authError as Error)
    }
  }, [profile, isAuthLoading, authError, setUser, setAuthLoading, setAuthError])

  const trailsQuery = useTrailsControllerFetchTrails({
    query: {
      select: data => data.trails.map(mapTrailDtoToTrail),
    },
  })

  const professorsQuery = useProfessorsControllerFetchProfessors({
    query: {
      select: data => data.professors.map(mapProfessorDtoToProfessor),
    },
  })

  const subjectsQuery = useSubjectsControllerFetchSubjects({
    query: {
      select: data => data.subjects.map(mapSubjectDtoToSubject),
    },
  })

  const isTagsLoading =
    trailsQuery.isLoading ||
    professorsQuery.isLoading ||
    subjectsQuery.isLoading
  const tagsError =
    trailsQuery.error || professorsQuery.error || subjectsQuery.error

  useEffect(() => {
    setTagsLoading(isTagsLoading)
    if (trailsQuery.data) {
      setTrails(trailsQuery.data)
    }

    if (professorsQuery.data) {
      setProfessors(professorsQuery.data)
    }

    if (subjectsQuery.data) {
      setSubjects(subjectsQuery.data)
    }

    if (tagsError) {
      setTagsError(tagsError as Error)
    }
  }, [
    trailsQuery.data,
    professorsQuery.data,
    subjectsQuery.data,
    isTagsLoading,
    tagsError,
    setTrails,
    setProfessors,
    setSubjects,
    setTagsLoading,
    setTagsError,
  ])

  return <>{children}</>
}
