'use client'

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
import { useQuery } from '@tanstack/react-query'

export default function Home() {
  const [selectedTrails, setSelectedTrails] = useState<string[]>([])
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<
    | {
        semester: number
        publishedYear: number
        subject: string
      }
    | undefined
  >()
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

  function toggleTrail(trailId: string) {
    if (selectedTrails.includes(trailId)) {
      setSelectedTrails(selectedTrails.filter(item => item !== trailId))
    } else {
      setSelectedTrails([...selectedTrails, trailId])
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
    subject: string
  }) => {
    console.log('Applying filters:', filters)
    setSelectedFilters(filters)
    applyFiltersOnURL(filters)
  }

  const projectsToDisplay = isLoadingProjects ? [] : projects || []

  const col1Projects = projectsToDisplay.filter((_, index) => index % 3 === 0)
  const col2Projects = projectsToDisplay.filter((_, index) => index % 3 === 1)
  const col3Projects = projectsToDisplay.filter((_, index) => index % 3 === 2)

  function applyFiltersOnURL(filters: {
    semester: number
    publishedYear: number
    subject: string
  }) {
    const params = new URLSearchParams()

    if (filters.semester > 0) {
      params.append('semester', filters.semester.toString())
    }

    if (filters.publishedYear > 0) {
      params.append('publishedYear', filters.publishedYear.toString())
    }

    if (filters.subject !== '') {
      params.append('subject', filters.subject)
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
            {trails.map(option => (
              <ToggleGroupItem
                onClick={() => toggleTrail(option.id)} // Aqui estamos usando o ID da trilha
                key={option.id}
                value={option.id}
                variant={
                  selectedTrails.includes(option.id) ? 'added' : 'default'
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
        {/* Coluna 1 */}
        <div className="flex flex-col gap-y-5">
          {isLoadingProjects
            ? [1, 2, 3].map(skeleton => (
                <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
              ))
            : col1Projects.map(project => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  bannerUrl={project.bannerUrl}
                  title={project.title}
                  author={project.author.name}
                  publishedYear={project.publishedYear}
                  semester={project.semester}
                  subject={project.subject}
                  description={project.description}
                  professors={project.professors}
                />
              ))}
        </div>

        {/* Coluna 2 com div estática */}
        <div className="flex flex-col gap-y-5">
          <div className="h-[201px] w-[332px] bg-slate-500" />
          {/* Div estática */}
          {isLoadingProjects
            ? [1, 2, 3].map(skeleton => (
                <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
              ))
            : col2Projects.map(project => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  bannerUrl={project.bannerUrl}
                  title={project.title}
                  author={project.author.name}
                  publishedYear={project.publishedYear}
                  semester={project.semester}
                  subject={project.subject}
                  description={project.description}
                  professors={project.professors}
                />
              ))}
        </div>

        {/* Coluna 3 */}
        <div className="flex flex-col gap-y-5">
          {isLoadingProjects
            ? [1, 2, 3].map(skeleton => (
                <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
              ))
            : col3Projects.map(project => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  bannerUrl={project.bannerUrl}
                  title={project.title}
                  author={project.author.name}
                  publishedYear={project.publishedYear}
                  semester={project.semester}
                  subject={project.subject}
                  description={project.description}
                  professors={project.professors}
                />
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
