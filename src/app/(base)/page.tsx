'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowUp, ListFilter } from 'lucide-react'
import Link from 'next/link'
import { type ElementType, useCallback, useEffect, useState } from 'react'

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
import { useTagsDependencies } from '@/contexts/hooks/use-tags-dependencies'
import type { Post } from '@/entities/project'
import { fetchPosts, filterPosts } from '@/functions/projects'

import { Audiovisual } from '@/components/assets/audiovisual'
import { Design } from '@/components/assets/design'
import { Games } from '@/components/assets/games'
import { Systems } from '@/components/assets/systems'
import { cn } from '@/lib/utils'

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

interface Filters {
  semester: number
  publishedYear: number
  subjectId: string
}

export default function Home() {
  const { trails } = useTagsDependencies()

  const [selectedTrails, setSelectedTrails] = useState<string[]>([])
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const [selectedFilters, setSelectedFilters] = useState<Filters>()
  const [filterParams, setFilterParams] = useState<string>('')

  const handleFilterPostsByTrail = useCallback(
    (posts: Post[]) => {
      return posts.filter(post => {
        if (selectedTrails.length < 1) {
          return post
        }

        return post.trails.some(trail => selectedTrails.includes(trail))
      })
    },
    [selectedTrails],
  )

  const handleFetchFilteredPosts = useCallback(async () => {
    const posts = await filterPosts(filterParams)

    return posts
  }, [filterParams])

  const handleFetchPosts = useCallback(async () => {
    if (selectedFilters) {
      const posts = await handleFetchFilteredPosts()
      return posts
    }

    const posts = await fetchPosts()
    return posts
  }, [selectedFilters, handleFetchFilteredPosts])

  const { data: projects, isLoading: isLoadingProjects } = useQuery<Post[]>({
    queryKey: ['posts', filterParams],
    queryFn: handleFetchPosts,
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

  const projectsToDisplay = isLoadingProjects
    ? []
    : (projects && handleFilterPostsByTrail(projects)) || []

  const postsLeftColumn = projectsToDisplay.filter(
    (_, index) => index % 3 === 0,
  )
  const postsMidColumn = projectsToDisplay.filter((_, index) => index % 3 === 1)
  const postsRightColumn = projectsToDisplay.filter(
    (_, index) => index % 3 === 2,
  )

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
      params.append('subjectId', filters.subjectId)
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
            {trails.data?.map(option => {
              const [Icon, borderColor, textColor] = trailsIcons[option.name]

              return (
                <ToggleGroupItem
                  onClick={() => toggleTrail(option.name)}
                  key={option.id}
                  value={option.name}
                  variant={
                    selectedTrails.includes(option.name) ? 'added' : 'default'
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
              <ListFilter size={18} className="text-deck-darkest" />
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
            : postsLeftColumn.map(post => (
                <Link key={post.id} href={`/project/${post.id}`}>
                  <ProjectCard
                    bannerUrl={post.bannerUrl}
                    title={post.title}
                    author={post.author.name}
                    publishedYear={post.publishedYear}
                    semester={post.semester}
                    subject={post.subject}
                    description={post.description}
                    professors={post.professors}
                    trails={post.trails}
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
            : postsMidColumn.map(post => (
                <Link key={post.id} href={`/project/${post.id}`}>
                  <ProjectCard
                    bannerUrl={post.bannerUrl}
                    title={post.title}
                    author={post.author.name}
                    publishedYear={post.publishedYear}
                    semester={post.semester}
                    subject={post.subject}
                    description={post.description}
                    professors={post.professors}
                    trails={post.trails}
                  />
                </Link>
              ))}
        </div>

        <div className="flex flex-col gap-y-5">
          {isLoadingProjects
            ? [1, 2, 3].map(skeleton => (
                <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
              ))
            : postsRightColumn.map(post => (
                <Link key={post.id} href={`/project/${post.id}`}>
                  <ProjectCard
                    bannerUrl={post.bannerUrl}
                    title={post.title}
                    author={post.author.name}
                    publishedYear={post.publishedYear}
                    semester={post.semester}
                    subject={post.subject}
                    description={post.description}
                    professors={post.professors}
                    trails={post.trails}
                  />
                </Link>
              ))}
        </div>
      </div>

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
