'use client'

import { ArrowUp, ListFilter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  type ElementType,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import homeWidget from '@/assets/widgets/homeWidget.svg'
import projectPostWidget from '@/assets/widgets/projectPostWidget.svg'
import { Audiovisual } from '@/components/assets/audiovisual'
import { Design } from '@/components/assets/design'
import { Games } from '@/components/assets/games'
import { SMD } from '@/components/assets/smd'
import { Systems } from '@/components/assets/systems'
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
import { cn } from '@/lib/utils'

const trailsIcons: Record<string, [ElementType, string, string, string]> = {
  Design: [
    Design,
    '#D41919',
    cn('bg-deck-bg hover:bg-deck-red-light text-deck-red border-deck-red'),
    cn('bg-deck-red text-deck-bg border-deck-red hover:bg-deck-red'),
  ],
  Sistemas: [
    Systems,
    '#0581C4',
    cn('bg-deck-bg hover:bg-deck-blue-light text-deck-blue border-deck-blue'),
    cn('bg-deck-blue text-deck-bg border-deck-blue hover:bg-deck-blue'),
  ],
  Audiovisual: [
    Audiovisual,
    '#E99700',
    cn(
      'bg-deck-bg hover:bg-deck-orange-light text-deck-orange border-deck-orange',
    ),
    cn('bg-deck-orange text-deck-bg border-deck-orange hover:bg-deck-orange'),
  ],
  Jogos: [
    Games,
    '#5BAD5E',
    cn(
      'bg-deck-bg hover:bg-deck-green-light text-deck-green border-deck-green',
    ),
    cn('bg-deck-green text-deck-bg border-deck-green hover:bg-deck-green'),
  ],
  SMD: [
    SMD,
    '#8B00D0',
    cn(
      'bg-deck-bg hover:bg-deck-purple-light text-deck-purple border-deck-purple',
    ),
    cn('bg-deck-purple text-deck-bg border-deck-purple hover:bg-deck-purple'),
  ],
}

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

  const { data: allPostsData, isLoading: isLoadingAll } =
    useProjectsControllerFetchPosts({
      query: {
        enabled: !filterParams,
      },
    })

  const { data: filteredPostsData, isLoading: isLoadingFiltered } =
    useProjectsControllerFilterPosts({
      request: {
        params: new URLSearchParams(filterParams),
      },
      query: {
        enabled: !!filterParams,
      },
    })

  // Casting because Orval types might miss internal fields like 'comments' etc if used in Post
  const allPosts = allPostsData?.posts as unknown as Post[] | undefined
  const filteredPosts = filteredPostsData?.posts as unknown as
    | Post[]
    | undefined

  const projects = filterParams ? filteredPosts : allPosts
  const isLoadingProjects = filterParams ? isLoadingFiltered : isLoadingAll

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
        <div className="mt-[111px] mb-[116px] h-[239px] w-[1036px] bg-deck-bg">
          <div className="flex h-full w-full flex-col items-center justify-center px-20">
            <div className="flex items-center gap-2 rounded-[18px] border border-deck-purple-icon px-3 py-2 font-medium text-deck-purple-icon">
              <SMD className="size-[22px] fill-deck-purple-icon" />
              <span>Todos os projetos. Todas as áreas. Um só Deck!</span>
            </div>

            <div className="flex flex-col items-center py-[30px]">
              <h1 className="font-extrabold text-5xl text-deck-darkest">
                EXPLORE PROJETOS ÚNICOS!
              </h1>

              <p className="px-[120px] pt-[18px] text-center text-deck-secondary-text text-lg">
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
        className="grid w-full max-w-[1036px] grid-cols-3 gap-5 py-5"
      >
        <div className="col-span-3 flex w-full justify-between">
          <div className="flex items-start gap-4">
            <ToggleGroup
              className="flex flex-wrap justify-start gap-4"
              value={selectedTrails}
              type="multiple"
            >
              {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is a temporary solution to avoid a complex refactor */}
              {trails.data?.map(option => {
                const [Icon, color, baseColor, activeColor] =
                  trailsIcons[option.name] || trailsIcons.SMD

                const [SMDIcon, SMDColor, SMDBaseColor, SMDActiveColor] =
                  trailsIcons.SMD

                return (
                  <ToggleGroupItem
                    onClick={() => toggleTrail(option.name)}
                    key={option.id}
                    value={option.name}
                    variant={
                      selectedTrails.includes(option.name) ? 'added' : 'default'
                    }
                    className={cn(
                      'gap-2 rounded-[18px] px-3 py-2',
                      selectedTrails.includes(option.name)
                        ? selectedTrails.length > 1
                          ? SMDActiveColor
                          : activeColor
                        : baseColor || SMDBaseColor,
                    )}
                  >
                    {selectedTrails.length > 1 &&
                    selectedTrails.includes(option.name) ? (
                      <SMDIcon
                        className="h-[18px] w-[18px]"
                        innerColor={
                          selectedTrails.includes(option.name)
                            ? '#fff'
                            : SMDColor
                        }
                        foregroundColor="transparent"
                      />
                    ) : (
                      <Icon
                        className="h-[18px] w-[18px]"
                        innerColor={
                          selectedTrails.includes(option.name) ? '#fff' : color
                        }
                        foregroundColor="transparent"
                      />
                    )}
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
                  'border border-deck-darkest',
                  filterParams &&
                    'bg-deck-darkest text-deck-bg-button hover:bg-deck-dark',
                )}
              >
                <ListFilter
                  size={18}
                  className={
                    filterParams ? 'text-deck-bg-button' : 'text-deck-darkest'
                  }
                />
                Filtros
              </FilterButton>
            </PopoverTrigger>

            <PopoverContent className="w-[300px] border border-deck-border bg-deck-bg p-4">
              <Filter onApplyFilters={applyFilters} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-5">
          <div className="flex min-w-[332px] flex-col gap-y-5">
            {isLoadingProjects
              ? [1, 2, 3].map(skeleton => (
                  <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
                ))
              : postsLeftColumn.map(post => (
                  <Link key={post.id} href={`/projects/${post.id}`}>
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

          <div className="flex min-w-[332px] flex-col gap-y-5">
            <div className="h-[201px] w-[332px]">
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

            {isLoadingProjects
              ? [1, 2, 3].map(skeleton => (
                  <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
                ))
              : postsMidColumn.map(post => (
                  <Link key={post.id} href={`/projects/${post.id}`}>
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

          <div className="flex min-w-[332px] flex-col gap-y-5">
            {isLoadingProjects
              ? [1, 2, 3].map(skeleton => (
                  <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
                ))
              : postsRightColumn.map(post => (
                  <Link key={post.id} href={`/projects/${post.id}`}>
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
            className="fixed right-[18%] bottom-10 flex h-10 w-10 items-center justify-center rounded-full bg-deck-bg-button text-deck-darkest hover:bg-deck-bg-hover max-2xl:right-10"
            type="button"
          >
            <ArrowUp size={24} />
          </button>
        )}
      </div>
    </>
  )
}
