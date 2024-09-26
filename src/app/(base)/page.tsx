'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowUp, Image, ListFilter } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

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
import type { Trail } from '@/entities/trail'
import { instance } from '@/lib/axios'
import Link from 'next/link'

interface Filters {
  semester: number
  publishedYear: number
  subjectId: string // Alterado para subjectId
}

export default function Home() {
  const [selectedTrails, setSelectedTrails] = useState<string[]>([]) // Armazena nomes das trilhas
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const [selectedFilters, setSelectedFilters] = useState<Filters>()
  const [filterParams, setFilterParams] = useState<string>('')

  const [trails, setTrails] = useState<Trail[]>([])

  const fetchTrails = useCallback(async () => {
    const { data } = await instance.get('/trails')
    setTrails(data.trails) // Ajuste de acordo com a estrutura da resposta da sua API
  }, [])

  const fetchFilteredPosts = useCallback(async () => {
    const { data } = await instance.get(`/projects/filter?${filterParams}`)
    return data.posts
  }, [filterParams])

  const fetchPosts = useCallback(async () => {
    if (selectedFilters) {
      return fetchFilteredPosts()
    }

    const { data } = await instance.get('/projects')
    return data.posts
  }, [selectedFilters, fetchFilteredPosts])

  useEffect(() => {
    fetchTrails()
  }, [fetchTrails])

  const { data: projects, isLoading: isLoadingProjects } = useQuery<Post[]>({
    queryKey: ['posts', filterParams],
    queryFn: fetchPosts,
  })

  function toggleTrail(trailName: string) {
    if (selectedTrails.includes(trailName)) {
      setSelectedTrails(selectedTrails.filter(item => item !== trailName))
    } else {
      setSelectedTrails([...selectedTrails, trailName])
    }
  }

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 50) {
        setShowScrollToTop(true)
      } else {
        setShowScrollToTop(false)
      }
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

  const applyFilters = (filters: {
    semester: number
    publishedYear: number
    subjectId: string
  }) => {
    setSelectedFilters(filters) // Armazenar filters diretamente
    applyFiltersOnURL(filters)
  }

  function updateFilterParamsWithSelectedTrails(selectedTrails: string[]) {
    const params = new URLSearchParams()

    if (selectedFilters?.semester) {
      params.append('semester', selectedFilters.semester.toString())
    }

    if (selectedFilters?.publishedYear) {
      params.append('publishedYear', selectedFilters.publishedYear.toString())
    }

    if (selectedFilters?.subjectId) {
      params.append('subjectIds', selectedFilters.subjectId) // Corrigido para subjectId
    }

    if (selectedTrails.length > 0) {
      params.append('trailNames', selectedTrails.join(','))
    }

    setFilterParams(params.toString())
  }

  // Atualiza filterParams sempre que selectedTrails mudar
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    updateFilterParamsWithSelectedTrails(selectedTrails)
  }, [selectedTrails])

  const projectsToDisplay = isLoadingProjects ? [] : projects || []

  // Filtra os projetos com base no subjectId
  const filteredProjects = projectsToDisplay.filter(project => {
    const hasSubject = selectedFilters?.subjectId
      ? project.subjectId.includes(selectedFilters.subjectId) // Verifica se o projeto contém o subjectId
      : true // Se não houver filtro de subject, retorna todos
    const hasTrail =
      selectedTrails.length > 0
        ? Array.isArray(project.trails) &&
          selectedTrails.some(trailName => project.trails.includes(trailName))
        : true // Se não houver filtro de trilha, retorna todos

    return hasSubject && hasTrail // Retorna true se ambos os filtros forem atendidos
  })

  // Dividing filtered projects into columns
  const col1Projects = filteredProjects.filter((_, index) => index % 3 === 0)
  const col2Projects = filteredProjects.filter((_, index) => index % 3 === 1)
  const col3Projects = filteredProjects.filter((_, index) => index % 3 === 2)

  function applyFiltersOnURL(filters: {
    semester: number
    publishedYear: number
    subjectId: string
  }) {
    const params = new URLSearchParams()

    if (filters.semester > 0) {
      params.append('semester', filters.semester.toString())
    }

    if (filters.publishedYear > 0) {
      params.append('publishedYear', filters.publishedYear.toString())
    }

    if (filters.subjectId) {
      params.append('subjectId', filters.subjectId) // Corrigido para subjectId
    }

    setFilterParams(params.toString())
  }

  return (
    <div className="grid w-full max-w-[1036px] grid-cols-3 gap-5 py-5">
      <div className="col-span-3 flex w-full justify-between">
        <div className="flex items-start gap-4">
          <ToggleGroup
            className="flex flex-wrap justify-start gap-4"
            value={selectedTrails}
            type="multiple"
          >
            {trails?.map(option => (
              <ToggleGroupItem
                onClick={() => toggleTrail(option.name)}
                key={option.id}
                value={option.name}
                variant={
                  selectedTrails.includes(option.name) ? 'added' : 'default'
                }
                className="gap-2"
              >
                <Image className="size-[18px]" />
                {option.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
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
        <div className="flex flex-col gap-y-5">
          {isLoadingProjects
            ? [1, 2, 3].map(skeleton => (
                <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
              ))
            : col1Projects.map(project => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <ProjectCard
                    bannerUrl={project.bannerUrl}
                    title={project.title}
                    author={project.author.name}
                    publishedYear={project.publishedYear}
                    semester={project.semester}
                    subject={project.subject}
                    description={project.description}
                    professors={project.professors}
                  />
                </Link>
              ))}
        </div>

        <div className="flex flex-col gap-y-5">
          <div className="h-[201px] w-[332px] bg-slate-500" />

          {isLoadingProjects
            ? [1, 2, 3].map(skeleton => (
                <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
              ))
            : col2Projects.map(project => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <ProjectCard
                    bannerUrl={project.bannerUrl}
                    title={project.title}
                    author={project.author.name}
                    publishedYear={project.publishedYear}
                    semester={project.semester}
                    subject={project.subject}
                    description={project.description}
                    professors={project.professors}
                  />
                </Link>
              ))}
        </div>

        <div className="flex flex-col gap-y-5">
          {isLoadingProjects
            ? [1, 2, 3].map(skeleton => (
                <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
              ))
            : col3Projects.map(project => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <ProjectCard
                    bannerUrl={project.bannerUrl}
                    title={project.title}
                    author={project.author.name}
                    publishedYear={project.publishedYear}
                    semester={project.semester}
                    subject={project.subject}
                    description={project.description}
                    professors={project.professors}
                  />
                </Link>
              ))}
        </div>
      </div>

      {showScrollToTop && (
        <button
          type="button"
          onClick={handleScrollToTop}
          className="fixed right-10 bottom-10 rounded-full bg-slate-900 p-3 text-white"
        >
          <ArrowUp />
        </button>
      )}
    </div>
  )
}
