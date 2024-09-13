import {
  Bookmark,
  GraduationCap,
  Search,
  Tag,
  TextCursor,
  User2,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'

const filters = [
  { id: 'title', label: 'Título' },
  { id: 'tags', label: 'Tags' },
  { id: 'profile', label: 'Perfil' },
  { id: 'professors', label: 'Professores' },
]

export function SearchInputWithFilters() {
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query) {
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }

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
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [query])

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId)
    setShowDropdown(false)
  }

  return (
    <div className="relative z-20 flex items-center justify-center">
      {activeFilter === null && (
        <Search size={18} className="absolute left-3 text-slate-500" />
      )}
      {activeFilter === 'title' && (
        <TextCursor size={18} className="absolute left-3 text-slate-500" />
      )}
      {activeFilter === 'tags' && (
        <Tag size={18} className="absolute left-3 text-slate-500" />
      )}
      {activeFilter === 'profile' && (
        <User2 size={18} className="absolute left-3 text-slate-500" />
      )}
      {activeFilter === 'professors' && (
        <GraduationCap size={18} className="absolute left-3 text-slate-500" />
      )}
      <Input
        className="w-[642px] pl-[46px]"
        input-size="md"
        placeholder="Pesquisar"
        type="text"
        onChange={e => setQuery(e.target.value)}
        value={query}
      />
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 w-full rounded-lg border border-slate-300 bg-white shadow-lg"
        >
          {filters.map(filter => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              key={filter.id}
              className={`flex cursor-pointer gap-1 p-2 hover:bg-slate-100 ${activeFilter === filter.id ? 'bg-slate-100' : ''}`}
              onClick={() => handleFilterClick(filter.id)}
            >
              <span className="flex items-center">
                <span className="ml-2">
                  {filter.id === 'title' && (
                    <TextCursor size={18} className="mr-4" />
                  )}
                  {filter.id === 'tags' && (
                    <Bookmark size={18} className="mr-4" />
                  )}
                  {filter.id === 'profile' && (
                    <User2 size={18} className="mr-4" />
                  )}
                  {filter.id === 'professors' && (
                    <GraduationCap size={18} className="mr-4" />
                  )}
                </span>
                {filter.label} com
              </span>
              "{query}"
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
