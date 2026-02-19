'use client'

import { ArrowUp, ListFilter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import homeWidget from '@/assets/widgets/homeWidget.svg'
import projectPostWidget from '@/assets/widgets/projectPostWidget.svg'
import { SMD } from '@/components/assets/smd'
import { FilterButton } from '@/components/filter/filter-button'
import { Filter } from '@/components/filter/filter-projects'
import { ProjectCard } from '@/components/project-card'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'
import { useTagsDependencies } from '@/contexts/hooks/use-tags-dependencies'
import type { Post } from '@/entities/project'
import {
  useProjectsControllerFetchPosts,
  useProjectsControllerFilterPosts,
} from '@/http/api'
import { getMultiTrailConfig, getTrailConfig } from '@/lib/trails-config'
import { cn } from '@/lib/utils'

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: feed page coordinates multiple independent UI states
export default function Home() {
  const { trails } = useTagsDependencies()
  const { student } = useAuthenticatedStudent()

  const [selectedTrails, setSelectedTrails] = useState<string[]>([])
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [filterParams, setFilterParams] = useState<string>('')
  const feedRef = useRef<HTMLDivElement | null>(null)

  const handleFilterPostsByTrail = useCallback(
    (posts: Post[]) => {
      return posts.filter(post => {
        if (selectedTrails.length < 1) {
          return post
        }

        return post.trails.some(trail => selectedTrails.includes(trail.name))
      })
    },
    [selectedTrails],
  )

  /* 
    Mapping:
    - fetchPosts -> useProjectsControllerFetchPosts
    - filterPosts -> useProjectsControllerFilterPosts
  */

  const {
    data: allPostsData,
    isLoading: isLoadingAll,
    isFetching: isFetchingAll,
  } =
    useProjectsControllerFetchPosts({
      query: {
        enabled: !filterParams,
        placeholderData: previousData => previousData,
      },
    })

  const {
    data: filteredPostsData,
    isLoading: isLoadingFiltered,
    isFetching: isFetchingFiltered,
  } =
    useProjectsControllerFilterPosts({
      request: {
        params: new URLSearchParams(filterParams),
      },
      query: {
        enabled: !!filterParams,
        queryKey: ['/posts/search', filterParams || ''],
        placeholderData: previousData => previousData,
      },
    })

  // Casting because Orval types might miss internal fields like 'comments' etc if used in Post
  const allPosts = allPostsData?.posts as unknown as Post[] | undefined
  const filteredPosts = filteredPostsData?.posts as unknown as
    | Post[]
    | undefined

  const projects = filterParams ? filteredPosts : allPosts
  const isLoadingProjects = filterParams ? isLoadingFiltered : isLoadingAll
  const isFetchingProjects = filterParams ? isFetchingFiltered : isFetchingAll

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

  const handleScrollToFeed = () => {
    if (feedRef.current) {
      const topPosition = feedRef.current.offsetTop
      window.scrollTo({
        top: topPosition,
        behavior: 'smooth', // Adiciona uma rolagem suave
      })
    }
  }

  const applyFilters = (filters: {
    semester: number
    publishedYear: number
    subjectId: string
  }) => {
    applyFiltersOnURL(filters)
  }

  const projectsToDisplay = (projects && handleFilterPostsByTrail(projects)) || []
  const showInitialSkeleton = isLoadingProjects && projectsToDisplay.length === 0

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

  // Função para determinar qual widget usar
  function getWidget(createdAt: Date): string {
    const oneMinuteInMs = 1 * 60 * 1000
    const timeDifference = Date.now() - new Date(createdAt).getTime()

    if (timeDifference < oneMinuteInMs) {
      return projectPostWidget
    }

    return homeWidget
  }

  return (
    <>
      {!student.data && (
        <div className="mt-10 mb-10 h-auto w-full max-w-[1036px] bg-deck-bg px-3 py-6 lg:mt-[111px] lg:mb-[116px] lg:h-[239px] lg:px-0 lg:py-0">
          <div className="flex h-full w-full flex-col items-center justify-center px-4 lg:px-20">
            <div className="flex items-center gap-2 rounded-[18px] border border-deck-purple-icon px-3 py-2 font-medium text-deck-purple-icon">
              <SMD className="size-[22px] fill-deck-purple-icon" />
              <span>Todos os projetos. Todas as áreas. Um só Deck!</span>
            </div>

            <div className="flex flex-col items-center py-[30px]">
              <h1 className="text-center font-extrabold text-3xl text-deck-darkest lg:text-5xl">
                EXPLORE PROJETOS ÚNICOS!
              </h1>

              <p className="px-0 pt-[18px] text-center text-base text-deck-secondary-text lg:px-[120px] lg:text-lg">
                Conheça o repositório de trabalhos multidisciplinares do curso
                de <b>Sistemas e Mídias Digitais</b>
              </p>
            </div>

            <Button
              variant="dark"
              onClick={handleScrollToFeed}
              className="h-[35px] w-[135px] transition-all duration-300 ease-in-out"
            >
              Explorar
            </Button>
          </div>
        </div>
      )}

      {/* Feed */}
      <div
        ref={feedRef}
        className="grid w-full max-w-[1036px] grid-cols-1 gap-5 px-3 py-4 md:grid-cols-2 md:py-5 lg:grid-cols-3 lg:px-0"
      >
        <div className="sticky top-[64px] z-20 col-span-full -mx-3 flex w-auto items-start justify-between gap-3 border-deck-border border-b bg-deck-bg/95 px-3 py-3 backdrop-blur md:static md:mx-0 md:w-full md:gap-4 md:border-b-0 md:bg-transparent md:px-0 md:py-0">
          <div className="min-w-0 flex-1">
            <ToggleGroup
              className="flex flex-wrap justify-start gap-2.5 md:gap-4"
              value={selectedTrails}
              type="multiple"
            >
              {trails.data?.map(option => {
                const isSelected = selectedTrails.includes(option.name)
                const isSMDOverride = selectedTrails.length > 1 && isSelected

                const smdConfig = getMultiTrailConfig()
                const trailConfig = getTrailConfig(option.name, option)
                const config = isSMDOverride ? smdConfig : trailConfig
                const { icon: Icon, color } = config

                const baseColor = isSMDOverride
                  ? cn(
                      'bg-deck-bg hover:bg-deck-purple-light text-deck-purple border-deck-purple',
                    )
                  : cn(
                      `bg-deck-bg hover:${config.bgColor}`,
                      `text-[${config.color}]`,
                      `border-[${config.color}]`,
                    )

                const activeColor = isSMDOverride
                  ? cn(
                      'bg-deck-purple text-deck-bg border-deck-purple hover:bg-deck-purple',
                    )
                  : cn(
                      `${config.bgDarkColor} text-deck-bg`,
                      `border-[${config.color}]`,
                      `hover:${config.bgDarkColor}`,
                    )

                return (
                  <ToggleGroupItem
                    onClick={() => toggleTrail(option.name)}
                    key={option.id}
                    value={option.name}
                    variant={isSelected ? 'added' : 'default'}
                    className={cn(
                      'h-9 shrink-0 gap-2 rounded-full px-3.5 py-0 font-medium text-[13px] md:h-10 md:text-sm',
                      isSelected ? activeColor : baseColor,
                    )}
                  >
                    <Icon
                      className="h-4 w-4 md:h-[18px] md:w-[18px]"
                      innerColor={isSelected ? '#fff' : color}
                      foregroundColor="transparent"
                    />
                    {option.name}
                  </ToggleGroupItem>
                )
              })}
            </ToggleGroup>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <FilterButton
                className={cn(
                  'h-9 w-auto shrink-0 justify-center self-start rounded-full border border-deck-darkest px-3.5 py-0 font-medium text-[13px] md:h-10 md:text-sm',
                  filterParams &&
                    'bg-deck-darkest text-deck-bg-button hover:bg-deck-dark',
                )}
              >
                <ListFilter
                  size={16}
                  className={cn(
                    'md:h-[18px] md:w-[18px]',
                    filterParams ? 'text-deck-bg-button' : 'text-deck-darkest',
                  )}
                />
                Filtros
              </FilterButton>
            </PopoverTrigger>

            <PopoverContent className="w-[min(320px,92vw)] border border-deck-border bg-deck-bg p-4">
              <Filter onApplyFilters={applyFilters} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="col-span-full flex flex-col items-center gap-y-5 md:hidden">
          {showInitialSkeleton
            ? [1, 2, 3].map(skeleton => (
                <Skeleton
                  key={skeleton}
                  className="h-[495px] w-full max-w-[332px]"
                />
              ))
            : projectsToDisplay.map(post => (
                <Link
                  key={post.id}
                  href={`/projects/${post.id}`}
                  className="w-full max-w-[332px]"
                >
                  <ProjectCard
                    bannerUrl={post.bannerUrl}
                    title={post.title}
                    author={post.author.name}
                    publishedYear={post.publishedYear}
                    semester={post.semester}
                    subject={post.subject?.name}
                    description={post.description}
                    professors={post.professors}
                    trails={post.trails}
                  />
                </Link>
              ))}
        </div>

        <div
          className={cn(
            'col-span-full hidden grid-cols-1 gap-5 transition-opacity md:grid md:grid-cols-2 lg:grid-cols-3',
            isFetchingProjects && !showInitialSkeleton ? 'opacity-70' : 'opacity-100',
          )}
          aria-busy={isFetchingProjects}
        >
          <div className="flex min-w-0 flex-col gap-y-5">
            {showInitialSkeleton
              ? [1, 2, 3].map(skeleton => (
                  <Skeleton
                    key={skeleton}
                    className="h-[495px] w-full max-w-[332px]"
                  />
                ))
              : postsLeftColumn.map(post => (
                  <Link
                    key={post.id}
                    href={`/projects/${post.id}`}
                    className="w-full max-w-[332px]"
                  >
                    <ProjectCard
                      bannerUrl={post.bannerUrl}
                      title={post.title}
                      author={post.author.name}
                      publishedYear={post.publishedYear}
                      semester={post.semester}
                      subject={post.subject?.name}
                      description={post.description}
                      professors={post.professors}
                      trails={post.trails}
                    />
                  </Link>
                ))}
          </div>

          <div className="flex min-w-0 flex-col gap-y-5">
            <div className="h-[201px] w-full max-w-[332px]">
              <Image
                src={
                  projectsToDisplay.length > 0
                    ? getWidget(new Date(projectsToDisplay[0].createdAt))
                    : homeWidget
                }
                width={332}
                height={201}
                alt="Placeholder"
              />
            </div>

            {showInitialSkeleton
              ? [1, 2, 3].map(skeleton => (
                  <Skeleton
                    key={skeleton}
                    className="h-[495px] w-full max-w-[332px]"
                  />
                ))
              : postsMidColumn.map(post => (
                  <Link
                    key={post.id}
                    href={`/projects/${post.id}`}
                    className="w-full max-w-[332px]"
                  >
                    <ProjectCard
                      bannerUrl={post.bannerUrl}
                      title={post.title}
                      author={post.author.name}
                      publishedYear={post.publishedYear}
                      semester={post.semester}
                      subject={post.subject?.name}
                      description={post.description}
                      professors={post.professors}
                      trails={post.trails}
                    />
                  </Link>
                ))}
          </div>

          <div className="flex min-w-0 flex-col gap-y-5">
            {showInitialSkeleton
              ? [1, 2, 3].map(skeleton => (
                  <Skeleton
                    key={skeleton}
                    className="h-[495px] w-full max-w-[332px]"
                  />
                ))
              : postsRightColumn.map(post => (
                  <Link
                    key={post.id}
                    href={`/projects/${post.id}`}
                    className="w-full max-w-[332px]"
                  >
                    <ProjectCard
                      bannerUrl={post.bannerUrl}
                      title={post.title}
                      author={post.author.name}
                      publishedYear={post.publishedYear}
                      semester={post.semester}
                      subject={post.subject?.name}
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
            className="fixed right-4 bottom-6 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-deck-bg-button text-deck-darkest hover:bg-deck-bg-hover lg:right-10 lg:bottom-10 lg:h-10 lg:w-10"
            type="button"
          >
            <ArrowUp size={24} />
          </button>
        )}
      </div>
    </>
  )
}
