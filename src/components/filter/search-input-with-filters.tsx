'use client'

import {
  TextCursor,
  User2,
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Input } from '../ui/input'

const filters = [
  { id: 'posts', label: 'Projetos', icon: TextCursor },
  { id: 'students', label: 'Alunos', icon: User2 },
]

export function SearchInputWithFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>('posts')
  const rootRef = useRef<HTMLDivElement>(null)

  const applyFiltersOnURL = useCallback(
    (type: string, value: string) => {
      const params = new URLSearchParams()

      if (value) {
        params.append('q', value.trim())
      }
      params.append('type', type)

      router.push(`/search?${params.toString()}`)
    },
    [router],
  )

  const handleFilterClick = (filterType: string) => {
    setActiveFilter(filterType)
    setShowDropdown(false)
    applyFiltersOnURL(filterType, query)
  }

  useEffect(() => {
    if (pathname !== '/search') {
      return
    }

    setQuery(searchParams.get('q') || '')
    setActiveFilter(searchParams.get('type') || 'posts')
  }, [pathname, searchParams])

  useEffect(() => {
    setShowDropdown(Boolean(query.trim()))

    const handleClickOutside = (event: MouseEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [query])

  function handleSubmit() {
    applyFiltersOnURL(activeFilter, query)
    setShowDropdown(false)
  }

  return (
    <div ref={rootRef} className="relative z-20 flex items-center justify-center">
      {activeFilter === 'posts' && (
        <TextCursor
          size={18}
          className="absolute left-3 z-30 text-deck-darkest"
        />
      )}

      {activeFilter === 'students' && (
        <User2 size={18} className="absolute left-3 z-30 text-deck-darkest" />
      )}

      <Input
        className="z-20 w-[min(642px,calc(100vw-1.5rem))] pl-[46px] hover:bg-deck-bg focus:border-deck-border md:w-[642px]"
        input-size="md"
        placeholder="Pesquisar"
        type="text"
        onChange={e => setQuery(e.target.value)}
        onKeyDown={event => {
          if (event.key === 'Enter') {
            event.preventDefault()
            handleSubmit()
          }
        }}
        value={query}
      />

      {showDropdown && (
        <div
          className="absolute top-[90%] left-0 z-20 w-full rounded-b-lg border border-slate-300 bg-deck-bg shadow-md"
        >
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`flex w-full cursor-pointer items-center gap-1 px-2 py-2 text-left hover:bg-slate-100 ${activeFilter === filter.id ? 'bg-slate-100' : ''}`}
              onClick={() => handleFilterClick(filter.id)}
              type="button"
            >
              <span className="ml-2">
                <filter.icon size={18} className="mr-4" />
              </span>
              <span className="truncate">
                {filter.label} com "{query}"
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
