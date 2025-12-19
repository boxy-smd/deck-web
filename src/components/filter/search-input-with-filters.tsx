'use client'

import {
  Bookmark,
  GraduationCap,
  Search,
  TextCursor,
  User2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Input } from '../ui/input'

const filters = [
  { id: 'title', label: 'Título' },
  { id: 'tag', label: 'Tags' },
  { id: 'name', label: 'Perfil' },
  { id: 'professorName', label: 'Professores' },
]

export function SearchInputWithFilters() {
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const applyFiltersOnURL = useCallback(
    (id: string, value: string) => {
      const params = new URLSearchParams()

      if (value) {
        params.append(id, value)
      }

      router.push(`/search?${params.toString()}`)
    },
    [router],
  )

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId)
    setShowDropdown(false)
    applyFiltersOnURL(filterId, query)
  }

  useEffect(() => {
    setShowDropdown(!!query)

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDropdown(false)
      }

      if (event.key === 'Enter' && activeFilter) {
        applyFiltersOnURL(activeFilter, query)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [query, activeFilter, applyFiltersOnURL])

  return (
    <div className="relative z-20 flex items-center justify-center">
      {showDropdown && (
        <div className="fixed top-0 left-0 z-10 h-screen w-screen bg-black bg-opacity-50" />
      )}

      {activeFilter === null && (
        <Search size={18} className="absolute left-3 z-30 text-deck-darkest" />
      )}

      {activeFilter === 'title' && (
        <TextCursor
          size={18}
          className="absolute left-3 z-30 text-deck-darkest"
        />
      )}

      {activeFilter === 'tag' && (
        <Bookmark
          size={18}
          className="absolute left-3 z-30 text-deck-darkest"
        />
      )}

      {activeFilter === 'name' && (
        <User2 size={18} className="absolute left-3 z-30 text-deck-darkest" />
      )}

      {activeFilter === 'professorName' && (
        <GraduationCap
          size={18}
          className="absolute left-3 z-30 text-deck-darkest"
        />
      )}

      <Input
        className="z-20 w-[642px] pl-[46px] hover:bg-deck-bg focus:border-deck-border"
        input-size="md"
        placeholder="Pesquisar"
        type="text"
        onChange={e => setQuery(e.target.value)}
        value={query}
      />

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-[90%] left-0 z-20 w-full rounded-b-lg border border-slate-300 bg-deck-bg"
        >
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`flex cursor-pointer gap-1 p-2 hover:bg-slate-100 ${activeFilter === filter.id ? 'bg-slate-100' : ''}`}
              onClick={() => handleFilterClick(filter.id)}
              type="button"
            >
              <span className="flex items-center">
                <span className="ml-2">
                  {filter.id === 'title' && (
                    <TextCursor size={18} className="mr-4" />
                  )}

                  {filter.id === 'tag' && (
                    <Bookmark size={18} className="mr-4" />
                  )}

                  {filter.id === 'name' && <User2 size={18} className="mr-4" />}

                  {filter.id === 'professorName' && (
                    <GraduationCap size={18} className="mr-4" />
                  )}
                </span>
                {filter.label} com "{query}"
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
