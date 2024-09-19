'use client'

import { FilterButton } from '@/components/filter/filter-button'
import { Filter } from '@/components/filter/filter-projects'
import { ProjectCard } from '@/components/project-card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Post } from '@/entities/project'
import { instance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { ArrowUp, Image, ListFilter } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

export default function Home() {
  const [selectedTrails, setSelectedTrails] = useState<string[]>([])
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const [selectedFilters, setSelectedFilters] = useState({
    semester: 0,
    publishedYear: 0,
    subject: '',
  })

  // Função para buscar os projetos
  const fetchPosts = useCallback(async () => {
    const { data } = await instance.get('/projects')
    return data.posts
  }, [])

  const { data: projects, isLoading } = useQuery<Post[]>({
    queryKey: ['posts', selectedTrails, selectedFilters],
    queryFn: fetchPosts,
  })

  // Função para buscar as trilhas
  const fetchTrails = async () => {
    const { data } = await instance.get('/trails')
    return data.trails
  }

  const { data: trails, isLoading: isLoadingTrails } = useQuery({
    queryKey: ['trails'],
    queryFn: fetchTrails,
  })

  // Função para alternar a seleção das trilhas
  function toggleTrail(trail: string) {
    setSelectedTrails(prevState =>
      prevState.includes(trail)
        ? prevState.filter(item => item !== trail)
        : [...prevState, trail]
    )
  }

  useEffect(() => {
    function handleScroll() {
      setShowScrollToTop(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // Aplicação de filtros
  const applyFilters = (filters: {
    semester: number
    publishedYear: number
    subject: string
  }) => {
    setSelectedFilters(filters)
  }

  // Lógica de filtragem dos projetos
  const filteredProjects = projects?.filter(project => {
    // Verificar se o projeto possui as trilhas selecionadas
    const matchesTrails =
      selectedTrails.length === 0 || // Se nenhuma trilha for selecionada, todos os projetos devem ser mostrados.
      selectedTrails.every(selectedTrail =>
        project.trails.includes(selectedTrail)
      ) // Verificar se todas as trilhas selecionadas estão no array de trilhas do projeto.

    const matchesSemester =
      !selectedFilters.semester || project.semester === selectedFilters.semester

    const matchesYear =
      !selectedFilters.publishedYear ||
      Number(project.publishedYear) === Number(selectedFilters.publishedYear)

    const matchesSubject =
      !selectedFilters.subject ||
      project.subjectId.toLowerCase() === selectedFilters.subject.toLowerCase()

    return matchesTrails && matchesSemester && matchesYear && matchesSubject
  })

  const col1Projects = filteredProjects?.filter((_, index) => index % 3 === 0)
  const col2Projects = filteredProjects?.filter((_, index) => index % 3 === 1)
  const col3Projects = filteredProjects?.filter((_, index) => index % 3 === 2)

  return (
    <div className="grid w-full max-w-[1036px] grid-cols-3 gap-5 py-5">
      <div className="col-span-3 flex w-full justify-between">
        <div className="flex items-start gap-4">
          {isLoadingTrails ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <ToggleGroup
              className="flex flex-wrap justify-start gap-4"
              value={selectedTrails}
              type="multiple"
            >
              {trails?.map(option => (
                <ToggleGroupItem
                  onClick={() => toggleTrail(option.name)} // Utilize o nome da trilha
                  key={option.id} // Utilize o ID como chave única
                  value={option.name} // Utilize o nome da trilha como valor
                  variant={
                    selectedTrails.includes(option.name) ? 'added' : 'default'
                  }
                  className="gap-2"
                >
                  <Image className="size-[18px]" />
                  {option.name} {/* Utilize o nome da trilha */}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <FilterButton>
              <ListFilter size={18} />
              Filtros
            </FilterButton>
          </PopoverTrigger>

          <PopoverContent className="w-[300px] bg-slate-50 p-4">
            <Filter onApplyFilters={applyFilters} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-5">
        {/* Coluna 1 */}
        <div className="flex flex-col gap-y-5">
          {isLoading
            ? [1, 2, 3].map(skeleton => (
                <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
              ))
            : col1Projects?.map(project => (
                <ProjectCard key={project.id} post={project} />
              ))}
        </div>

        {/* Coluna 2 com div estática */}
        <div className="flex flex-col gap-y-5">
          <div className="h-[201px] w-[332px] bg-slate-500" />
          {/* Div estática */}
          {isLoading
            ? [1, 2, 3].map(skeleton => (
                <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
              ))
            : col2Projects?.map(project => (
                <ProjectCard key={project.id} post={project} />
              ))}
        </div>

        {/* Coluna 3 */}
        <div className="flex flex-col gap-y-5">
          {isLoading
            ? [1, 2, 3].map(skeleton => (
                <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
              ))
            : col3Projects?.map(project => (
                <ProjectCard key={project.id} post={project} />
              ))}
        </div>
      </div>

      {showScrollToTop && (
        <button
          type="button"
          onClick={handleScrollToTop}
          className="fixed right-[18%] bottom-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 max-2xl:right-10"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  )
}
