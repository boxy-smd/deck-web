'use client'

import { ArrowUp, ListFilter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from 'nuqs'
import { type ReactNode, Suspense, useEffect, useState } from 'react'
import searchWidget from '@/assets/widgets/searchWidget.svg'
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
import type { Post } from '@/entities/project'
import {
  useProjectsControllerFetchPosts,
  useProjectsControllerFilterPosts,
  useUsersControllerFetchStudents,
} from '@/http/api'
import {
  mapProjectSummaryDtoToPost,
  mapUserSummaryDtoToStudent,
} from '@/lib/mappers'
import { getMultiTrailConfig, getTrailConfig } from '@/lib/trails-config'
import { cn } from '@/lib/utils'

interface TrailToggleItemProps {
  option: { id: string; name: string }
  isSelected: boolean
  hasMultipleSelected: boolean
  onToggle: () => void
}

function TrailToggleItem({
  option,
  isSelected,
  hasMultipleSelected,
  onToggle,
}: TrailToggleItemProps) {
  const isSMDOverride = hasMultipleSelected && isSelected
  const smdConfig = getMultiTrailConfig()
  const trailConfig = getTrailConfig(option.name)

  const config = isSMDOverride ? smdConfig : trailConfig
  const { icon: Icon, color } = config

  // Cores para estados base (não selecionado) e ativo (selecionado)
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
    ? cn('bg-deck-purple text-deck-bg border-deck-purple hover:bg-deck-purple')
    : cn(
        `${config.bgDarkColor} text-deck-bg`,
        `border-[${config.color}]`,
        `hover:${config.bgDarkColor}`,
      )

  return (
    <ToggleGroupItem
      onClick={onToggle}
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
}

interface ProjectColumnProps {
  isLoading: boolean
  projects: Post[]
  header?: ReactNode
}

function ProjectColumn({ isLoading, projects, header }: ProjectColumnProps) {
  return (
    <div className="flex min-w-0 flex-col gap-y-5">
      {header}
      {isLoading
        ? [1, 2, 3].map(skeleton => (
            <Skeleton key={skeleton} className="h-[495px] w-full max-w-[332px]" />
          ))
        : projects.map(project => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="w-full max-w-[332px]"
            >
              <ProjectCard
                key={project.id}
                bannerUrl={project.bannerUrl}
                title={project.title}
                author={project.author.name}
                publishedYear={project.publishedYear}
                semester={project.semester}
                subject={project.subject?.name}
                description={project.description}
                professors={project.professors}
                trails={project.trails}
              />
            </Link>
          ))}
    </div>
  )
}

function useSearchFilters() {
  const [searchQuery] = useQueryState('q', parseAsString.withDefault(''))
  const [searchType] = useQueryState('type', parseAsString.withDefault('posts'))

  const [selectedTrails, setSelectedTrails] = useQueryState(
    'trails',
    parseAsArrayOf(parseAsString).withDefault([]),
  )

  const [semester, setSemester] = useQueryState(
    'semester',
    parseAsInteger.withDefault(0),
  )
  const [publishedYear, setPublishedYear] = useQueryState(
    'year',
    parseAsInteger.withDefault(0),
  )
  const [subjectId, setSubjectId] = useQueryState(
    'subjectId',
    parseAsString.withDefault(''),
  )

  const apiParams = new URLSearchParams()
  if (searchQuery) {
    apiParams.append('title', searchQuery)
  }
  if (semester) {
    apiParams.append('semester', semester.toString())
  }
  if (publishedYear) {
    apiParams.append('publishedYear', publishedYear.toString())
  }
  if (subjectId) {
    apiParams.append('subjectId', subjectId)
  }

  if (selectedTrails) {
    for (const t of selectedTrails) {
      apiParams.append('trails', t)
    }
  }

  const isFiltering = !!(
    searchQuery ||
    (selectedTrails?.length ?? 0) > 0 ||
    semester ||
    publishedYear ||
    subjectId
  )

  return {
    searchQuery,
    searchType,
    selectedTrails,
    semester,
    publishedYear,
    subjectId,
    apiParams,
    isFiltering,
    setSelectedTrails,
    setSemester,
    setPublishedYear,
    setSubjectId,
  }
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: search page coordinates query params, two data sources and multiple layouts
function SearchContent() {
  const { trails } = useTagsDependencies()
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const {
    searchQuery,
    searchType,
    selectedTrails,
    semester,
    publishedYear,
    subjectId,
    apiParams,
    isFiltering,
    setSelectedTrails,
    setSemester,
    setPublishedYear,
    setSubjectId,
  } = useSearchFilters()

  const {
    data: allPostsData,
    isLoading: isLoadingAll,
    isFetching: isFetchingAll,
  } =
    useProjectsControllerFetchPosts({
      query: {
        enabled:
          searchType === 'posts' &&
          !searchQuery &&
          selectedTrails.length === 0 &&
          !semester &&
          !publishedYear &&
          !subjectId,
        placeholderData: previousData => previousData,
      },
    })

  const {
    data: searchPostsData,
    isLoading: isLoadingSearch,
    isFetching: isFetchingSearch,
  } =
    useProjectsControllerFilterPosts({
      request: {
        params: apiParams,
      },
      query: {
        enabled: searchType === 'posts' && isFiltering,
        queryKey: ['/posts/search', apiParams.toString()],
        placeholderData: previousData => previousData,
      },
    })

  const {
    data: studentsData,
    isLoading: isLoadingStudents,
    isFetching: isFetchingStudents,
  } =
    useUsersControllerFetchStudents(
      {
        name: searchQuery,
      },
      {
        query: {
          enabled: searchType === 'students',
          placeholderData: previousData => previousData,
        },
      },
    )

  // Casting and extracting lists using mappers
  const allPosts = allPostsData?.posts?.map(mapProjectSummaryDtoToPost)
  const searchPostsList = searchPostsData?.posts?.map(
    mapProjectSummaryDtoToPost,
  )
  const students = studentsData?.users?.map(mapUserSummaryDtoToStudent)

  const projects = isFiltering ? searchPostsList : allPosts
  const isLoadingProjects = isFiltering ? isLoadingSearch : isLoadingAll
  const isFetchingProjects = isFiltering ? isFetchingSearch : isFetchingAll

  function toggleTrail(trailId: string) {
    setSelectedTrails((prevState: string[] | null) => {
      const current = prevState || [] // nuqs might return null if not set
      const newState = current.includes(trailId)
        ? current.filter(item => item !== trailId)
        : [...current, trailId]

      return newState
    })
  }

  // Scroll to top logic remains same...
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
    // nuqs setters update URL automatically
    setSemester(filters.semester > 0 ? filters.semester : null)
    setPublishedYear(filters.publishedYear > 0 ? filters.publishedYear : null)
    setSubjectId(filters.subjectId || null)
  }

  // applyFiltersOnURL is no longer needed!

  // Client-side filtering as fallback or complementary?
  // With Orval/Backend params, we shouldn't need client-side filtering if API does it.
  // But if API doesn't support all filters, client-side is backup.
  // Legacy code did client-side filtering on `projects` list.
  // `useProjectsControllerFilterPosts` might return filtered list?
  // If we rely on Backend, we should trust `projects` (which is `searchPostsList` or `allPosts`).
  // However, `allPosts` (FetchPosts) returns EVERYTHING? Or paginated?
  // `useProjectsControllerFetchPosts` -> `/posts`. Probably all or paginated.
  // If we fetch ALL, we MUST filter client side.
  // If we use `filterPosts` endpoint, backend does it.
  // Legacy logic used `projects?.filter(...)` on `data` from `useQuery`.
  // `fetchPosts` returns `posts`.

  // My strategy: Pass filters to API. If API supports it, great.
  // But strictly, let's keep client-side filtering logic for `allPosts` path?
  // NO, if `isFiltering` is true, we use `useProjectsControllerFilterPosts`.
  // If `projects` comes from `searchPostsList`, it SHOULD be filtered by backend.
  // If `projects` comes from `allPosts`, it has NO filters active (isFiltering=false).
  // So client-side filtering `filteredProjects` block is redundant or only needed if backend filter is partial?
  // Let's assume Backend handles it for `searchPostsData`.
  // But wait, `allPostsData` is fetched when NO filters.
  // So `filteredProjects` logic is likely obsolete IF we trust `apiParams` passed to `useProjectsControllerFilterPosts`.

  // However, to be safe and robust (and match legacy behavior exactly just in case):
  // I will keep the client side filter BUT apply it to `projects`?
  // Actually, if I pass params to backend, I expect backend to filter.
  // Double filtering (Client+Backend) is fine.
  // But `allPosts` (when isFiltering = false) means NO filters. So client filter naturally passes everything.
  // So `filteredProjects` is just `projects`.

  const filteredProjects = projects

  const projectsToDisplay = filteredProjects || []
  const showInitialProjectsSkeleton =
    isLoadingProjects && projectsToDisplay.length === 0
  const hasProjects = projectsToDisplay.length > 0
  const shouldRenderPostColumns = showInitialProjectsSkeleton || hasProjects

  const col1Projects = projectsToDisplay.filter((_, index) => index % 3 === 0)
  const col2Projects = projectsToDisplay.filter((_, index) => index % 3 === 1)
  const col3Projects = projectsToDisplay.filter((_, index) => index % 3 === 2)
  const studentsToDisplay = students || []
  const hasStudents = studentsToDisplay.length > 0

  return (
    <div
      className={cn(
        'grid w-full max-w-[1036px] grid-cols-1 gap-5 px-3 py-4 transition-opacity md:grid-cols-2 md:py-5 lg:grid-cols-3 lg:px-0',
        searchType === 'posts' && isFetchingProjects && !showInitialProjectsSkeleton
          ? 'opacity-70'
          : 'opacity-100',
      )}
      aria-busy={searchType === 'posts' ? isFetchingProjects : isFetchingStudents}
    >
      {searchType === 'posts' && (
        <>
          <div className="sticky top-[64px] z-20 col-span-full -mx-3 flex w-auto items-start justify-between gap-3 border-deck-border border-b bg-deck-bg/95 px-3 py-3 backdrop-blur md:static md:mx-0 md:w-full md:border-b-0 md:bg-transparent md:px-0 md:py-0 lg:gap-4">
            <div className="min-w-0 flex-1">
              <ToggleGroup
                className="flex flex-wrap justify-start gap-2.5 md:gap-4"
                value={selectedTrails}
                type="multiple"
              >
                {trails.data?.map(option => (
                  <TrailToggleItem
                    key={option.id}
                    option={option}
                    isSelected={selectedTrails?.includes(option.name) ?? false}
                    hasMultipleSelected={(selectedTrails?.length ?? 0) > 1}
                    onToggle={() => toggleTrail(option.name)}
                  />
                ))}
              </ToggleGroup>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <FilterButton className="h-9 w-auto shrink-0 justify-center self-start rounded-full px-3.5 py-0 font-medium text-[13px] lg:h-10 lg:text-sm">
                  <ListFilter size={16} className="lg:h-[18px] lg:w-[18px]" />
                  Filtros
                </FilterButton>
              </PopoverTrigger>

              <PopoverContent className="w-[min(320px,92vw)] bg-deck-bg p-4">
                <Filter onApplyFilters={applyFilters} />
              </PopoverContent>
            </Popover>
          </div>

          {searchType === 'posts' && !isLoadingProjects && !hasProjects && (
              <div className="col-span-full flex justify-center px-2 py-8">
                <p className="text-center text-base text-slate-500 md:text-lg">
                  Nenhum projeto encontrado com os filtros aplicados.
                </p>
              </div>
            )}

          {shouldRenderPostColumns && (
            <>
              <ProjectColumn
                isLoading={showInitialProjectsSkeleton}
                projects={col1Projects}
              />

              <ProjectColumn
                isLoading={showInitialProjectsSkeleton}
                projects={col2Projects}
                header={
                  <div className="h-[201px] w-full max-w-[332px]">
                    <Image
                      src={searchWidget}
                      width={332}
                      height={201}
                      alt="Placeholder"
                    />
                  </div>
                }
              />

              <ProjectColumn
                isLoading={showInitialProjectsSkeleton}
                projects={col3Projects}
              />
            </>
          )}
        </>
      )}

      {searchType === 'students' && (
        <div
          className={cn(
            'col-span-full flex flex-col gap-4 pt-4 transition-opacity md:gap-5 md:pt-5',
            isFetchingStudents && !isLoadingStudents ? 'opacity-70' : 'opacity-100',
          )}
          aria-busy={isFetchingStudents}
        >
          {isLoadingStudents && !hasStudents
            ? [1, 2, 3].map(skeleton => (
                <Skeleton
                  key={skeleton}
                  className="h-[140px] w-full rounded-xl"
                />
              ))
            : hasStudents
              ? studentsToDisplay.map(student => (
                  <Link
                    href={`/projects/profile/${student.username}`}
                    key={student.id}
                    className="w-full"
                  >
                    <StudentCard {...student} />
                  </Link>
                ))
              : (
                  <div className="flex justify-center px-2 py-8">
                    <p className="text-center text-base text-slate-500 md:text-lg">
                      Nenhum perfil encontrado para sua busca.
                    </p>
                  </div>
                )}
        </div>
      )}

      {showScrollToTop && (
        <button
            onClick={handleScrollToTop}
          className="fixed right-4 bottom-6 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-deck-bg-button text-deck-darkest hover:bg-deck-bg-hover lg:right-10 lg:bottom-10 lg:h-10 lg:w-10"
          type="button"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {searchType === 'posts' && (
        <div
          className="sr-only"
          aria-live="polite"
        >
          {isFetchingProjects ? 'Atualizando resultados...' : 'Resultados atualizados.'}
        </div>
      )}
    </div>
  )
}

export default function Search() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  )
}
