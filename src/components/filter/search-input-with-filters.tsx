'use client'

import {
  Bookmark,
  GraduationCap,
  Search,
  Tag,
  TextCursor,
  User2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'

// Definição dos filtros disponíveis
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

  // useEffect para lidar com o dropdown e eventos de teclado/mouse
  useEffect(() => {
    setShowDropdown(!!query) // Mostra o dropdown se houver query

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
        applyFiltersOnURL(activeFilter, query) // Chama a função de busca ao pressionar Enter
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [query, activeFilter])

  // Lidar com o clique nos filtros
  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId) // Atualiza o filtro ativo
    setShowDropdown(false) // Fecha o dropdown após a seleção
    applyFiltersOnURL(filterId, query)
  }

  function applyFiltersOnURL(id: string, value: string) {
    const params = new URLSearchParams()

    if (value) {
      params.append(id, value)
    }

    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="relative z-20 flex items-center justify-center">
      {/* Ícone de acordo com o filtro ativo */}
      {activeFilter === null && (
        <Search size={18} className="absolute left-3 text-slate-500" />
      )}

      {activeFilter === 'title' && (
        <TextCursor size={18} className="absolute left-3 text-slate-500" />
      )}

      {activeFilter === 'tag' && (
        <Tag size={18} className="absolute left-3 text-slate-500" />
      )}

      {activeFilter === 'name' && (
        <User2 size={18} className="absolute left-3 text-slate-500" />
      )}

      {activeFilter === 'professorName' && (
        <GraduationCap size={18} className="absolute left-3 text-slate-500" />
      )}

      {/* Input de pesquisa */}
      <Input
        className="w-[642px] pl-[46px]"
        input-size="md"
        placeholder="Pesquisar"
        type="text"
        onChange={e => setQuery(e.target.value)} // Atualiza a consulta conforme o usuário digita
        value={query}
      />
      {/* Dropdown de filtros */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 w-full rounded-lg border border-slate-300 bg-white"
        >
          {filters.map(filter => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
              key={filter.id}
              className={`flex cursor-pointer gap-1 p-2 hover:bg-slate-100 ${activeFilter === filter.id ? 'bg-slate-100' : ''}`}
              onClick={() => handleFilterClick(filter.id)} // Chama a busca ao clicar
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
