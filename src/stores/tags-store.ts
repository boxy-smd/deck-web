import { create } from 'zustand'
import type { Professor } from '@/entities/professor'
import type { Subject } from '@/entities/subject'
import type { Trail } from '@/entities/trail'

interface TagsState {
  trails: Trail[]
  professors: Professor[]
  subjects: Subject[]
  isLoading: boolean
  error: Error | null
  setTrails: (trails: Trail[]) => void
  setProfessors: (professors: Professor[]) => void
  setSubjects: (subjects: Subject[]) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: Error | null) => void
}

export const useTagsStore = create<TagsState>(set => ({
  trails: [],
  professors: [],
  subjects: [],
  isLoading: false,
  error: null,
  setTrails: trails => set({ trails }),
  setProfessors: professors => set({ professors }),
  setSubjects: subjects => set({ subjects }),
  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error, isLoading: false }),
}))
