'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowUp, ListFilter } from 'lucide-react'
import Link from 'next/link'
import { type ElementType, useCallback, useEffect, useState } from 'react'

import searchImage from '@/assets/search.svg'
import { Audiovisual } from '@/components/assets/audiovisual'
import { Design } from '@/components/assets/design'
import { Games } from '@/components/assets/games'
import { Systems } from '@/components/assets/systems'
import { FilterButton } from '@/components/filter/filter-button'
import { Filter } from '@/components/filter/filter-projects'
import { ProjectCard } from '@/components/project-card'
import { StudentCard } from '@/components/student-card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useTagsDependencies } from '@/contexts/hooks/use-tags-dependencies'
import type { Student } from '@/entities/profile'
import type { Post } from '@/entities/project'
import { fetchPosts, searchPosts } from '@/functions/projects'
import { searchStudents } from '@/functions/students'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const trailsIcons: Record<string, [ElementType, string, string, string]> = {
  Design: [
    Design,
    '#D41919',
    cn('text-deck-red-dark'),
    cn('bg-deck-red-light'),
  ],
  Sistemas: [
    Systems,
    '#0581C4',
    cn('text-deck-blue-dark'),
    cn('bg-deck-blue-light'),
  ],
  Audiovisual: [
    Audiovisual,
    '#E99700',
    cn('text-deck-orange-dark'),
    cn('bg-deck-orange-light'),
  ],
  Jogos: [
    Games,
    '#5BAD5E',
    cn('text-deck-green-dark'),
    cn('bg-deck-green-light'),
  ],
  SMD: [
    Design,
    '#8B00D0',
    cn('text-deck-purple-dark'),
    cn('bg-deck-purple-light'),
  ],
}

export default function Search() {
  const { trails } = useTagsDependencies()

  const [selectedTrails, setSelectedTrails] = useState<string[]>([])
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<{
    semester: number
    publishedYear: number
    subject: string
  }>({
    semester: 0,
    publishedYear: 0,
    subject: '',
  })
  const [filterParams, setFilterParams] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchType, setSearchType] = useState<'posts' | 'students'>()

  const handleFetchPosts = useCallback(async () => {
    if (searchQuery) {
      return searchPosts(searchQuery)
    }

    const posts = await fetchPosts()
    return posts
  }, [searchQuery])

  const fetchSearchStudents = useCallback(async () => {
    const students = await searchStudents(searchQuery)
    return students
  }, [searchQuery])

  const { data: projects, isLoading: isLoadingProjects } = useQuery<Post[]>({
    queryKey: [
      'posts',
      filterParams,
      searchQuery,
      selectedTrails,
      selectedFilters,
    ],
    queryFn: handleFetchPosts,
    enabled: searchType === 'posts',
  })

  const { data: students, isLoading: isLoadingStudents } = useQuery<Student[]>({
    queryKey: [
      'students',
      filterParams,
      searchQuery,
      selectedTrails,
      selectedFilters,
    ],
    queryFn: fetchSearchStudents,
    enabled: searchType === 'students',
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const title = params.has('title') ? `title=${params.get('title')}` : ''
    const name = params.has('name') ? `name=${params.get('name')}` : ''
    const tag = params.has('tag') ? `tag=${params.get('tag')}` : ''
    const professorName = params.has('professorName')
      ? `professorName=${params.get('professorName')}`
      : ''

    setSearchType(name ? 'students' : 'posts')
    setSearchQuery(title || name || tag || professorName)
  }, [])

  function toggleTrail(trailId: string) {
    setSelectedTrails(prevState => {
      const newState = prevState.includes(trailId)
        ? prevState.filter(item => item !== trailId)
        : [...prevState, trailId]

      return newState
    })
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

  const applyFilters = (filters: {
    semester: number
    publishedYear: number
    subjectId: string
  }) => {
    setSelectedFilters({
      semester: filters.semester,
      publishedYear: filters.publishedYear,
      subject: filters.subjectId,
    })
    applyFiltersOnURL(filters)
  }

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

    if (filters.subjectId !== '') {
      params.append('subjectId', filters.subjectId)
    }

    setFilterParams(params.toString())
  }

  const filteredProjects = projects?.filter(project => {
    const matchesTrails =
      selectedTrails.length === 0 ||
      selectedTrails.every(selectedTrail => {
        return project.trails.includes(selectedTrail)
      })

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

  const projectsToDisplay = isLoadingProjects ? [] : filteredProjects || []

  const col1Projects = projectsToDisplay.filter((_, index) => index % 3 === 0)
  const col2Projects = projectsToDisplay.filter((_, index) => index % 3 === 1)
  const col3Projects = projectsToDisplay.filter((_, index) => index % 3 === 2)

  return (
    <div className="grid w-full max-w-[1036px] grid-cols-3 gap-5 py-5">
      {searchType === 'posts' && (
        <>
          <div className="col-span-3 flex w-full justify-between">
            <div className="flex items-start gap-4">
              <ToggleGroup
                className="flex flex-wrap justify-start gap-4"
                value={selectedTrails}
                type="multiple"
              >
                {trails.data?.map(option => {
                  const [Icon, borderColor, textColor] =
                    trailsIcons[option.name]

                  return (
                    <ToggleGroupItem
                      onClick={() => toggleTrail(option.name)}
                      key={option.id}
                      value={option.name}
                      variant={
                        selectedTrails.includes(option.name)
                          ? 'added'
                          : 'default'
                      }
                      className={`gap-2 bg-deck-bg ${textColor}`} // Adiciona a cor do texto dinamicamente como classe
                      style={{
                        border: selectedTrails.includes(option.name)
                          ? `2px solid ${borderColor}` // Aplica a borda dinamicamente
                          : `2px solid ${borderColor}`, // Sem borda quando não selecionado
                      }}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                      {option.name}
                    </ToggleGroupItem>
                  )
                })}
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

          {searchType === 'posts' &&
            !isLoadingProjects &&
            projectsToDisplay.length === 0 && (
              <div className="col-span-3 flex justify-center">
                <p className="text-lg text-slate-500">
                  Nenhum projeto encontrado com os filtros aplicados.
                </p>
              </div>
            )}

          <div className="flex gap-5">
            <div className="flex flex-col gap-y-5">
              {isLoadingProjects
                ? [1, 2, 3].map(skeleton => (
                    <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
                  ))
                : col1Projects.map(project => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <ProjectCard
                        key={project.id}
                        bannerUrl={project.bannerUrl}
                        title={project.title}
                        author={project.author.name}
                        publishedYear={project.publishedYear}
                        semester={project.semester}
                        subject={project.subject}
                        description={project.description}
                        professors={project.professors}
                        trails={project.trails}
                      />
                    </Link>
                  ))}
            </div>

            <div className="flex flex-col gap-y-5">
              <div className="h-[201px] w-[332px]">
                <Image
                  src={searchImage}
                  width={332}
                  height={201}
                  alt="Placeholder"

                />
              </div>
              {isLoadingProjects
                ? [1, 2, 3].map(skeleton => (
                    <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
                  ))
                : col2Projects.map(project => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <ProjectCard
                        bannerUrl={project.bannerUrl}
                        title={project.title}
                        author={project.author.name}
                        publishedYear={project.publishedYear}
                        semester={project.semester}
                        subject={project.subject}
                        description={project.description}
                        professors={project.professors}
                        trails={project.trails}
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
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <ProjectCard
                        bannerUrl={project.bannerUrl}
                        title={project.title}
                        author={project.author.name}
                        publishedYear={project.publishedYear}
                        semester={project.semester}
                        subject={project.subject}
                        description={project.description}
                        professors={project.professors}
                        trails={project.trails}
                      />
                    </Link>
                  ))}
            </div>
          </div>
        </>
      )}

      {students && searchType === 'students' && (
        <div className="flex flex-col gap-5 pt-5">
          {isLoadingStudents
            ? [1, 2, 3].map(skeleton => (
                <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
              ))
            : students.map(student => (
                <Link href={`/profile/${student.username}`} key={student.id}>
                  <StudentCard
                    id={student.id}
                    name={student.name}
                    username={student.username}
                    semester={student.semester}
                    profileUrl={student.profileUrl}
                    trails={student.trails}
                  />
                </Link>
              ))}
        </div>
      )}
      {showScrollToTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed right-[18%] bottom-10 flex h-10 w-10 items-center justify-center rounded-full bg-deck-bg-button text-deck-darkest hover:bg-deck-bg-hover max-2xl:right-10"
          type="button"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  )
}
