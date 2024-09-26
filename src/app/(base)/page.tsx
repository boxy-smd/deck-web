'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowUp, Image, ListFilter } from 'lucide-react'
import Link from 'next/link'
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
import { useTagsDependencies } from '@/contexts/hooks/use-tags-dependencies'
import type { Post } from '@/entities/project'
import { fetchPosts, filterPosts } from '@/functions/projects'

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
            {trails.data?.map(option => (
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
