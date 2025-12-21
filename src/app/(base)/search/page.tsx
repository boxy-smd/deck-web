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
import {
  type ElementType,
  type ReactNode,
  Suspense,
  useEffect,
  useState,
} from 'react'
import searchWidget from '@/assets/widgets/searchWidget.svg'
import { Audiovisual } from '@/components/assets/audiovisual'
import { Design } from '@/components/assets/design'
import { Games } from '@/components/assets/games'
import { SMD } from '@/components/assets/smd'
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
  const [Icon, color, baseColor, activeColor] =
    trailsIcons[option.name] || trailsIcons.SMD
  const [SMDIcon, SMDColor, SMDBaseColor, SMDActiveColor] = trailsIcons.SMD

  const isSMDOverride = hasMultipleSelected && isSelected
  const finalActiveColor = isSMDOverride ? SMDActiveColor : activeColor
  const finalBaseColor = baseColor || SMDBaseColor

  return (
    <ToggleGroupItem
      onClick={onToggle}
      value={option.name}
      variant={isSelected ? 'added' : 'default'}
      className={cn(
        'gap-2 rounded-[18px] px-3 py-2',
        isSelected ? finalActiveColor : finalBaseColor,
      )}
    >
      {isSMDOverride ? (
        <SMDIcon
          className="h-[18px] w-[18px]"
          innerColor={isSelected ? '#fff' : SMDColor}
          foregroundColor="transparent"
        />
      ) : (
        <Icon
          className="h-[18px] w-[18px]"
          innerColor={isSelected ? '#fff' : color}
          foregroundColor="transparent"
        />
      )}
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
    <div className="flex flex-col gap-y-5">
      {header}
      {isLoading
        ? [1, 2, 3].map(skeleton => (
            <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
          ))
        : projects.map(project => (
            <Link key={project.id} href={`/projects/${project.id}`}>
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

  const { data: allPostsData, isLoading: isLoadingAll } =
    useProjectsControllerFetchPosts({
      query: {
        enabled:
          searchType === 'posts' &&
          !searchQuery &&
          selectedTrails.length === 0 &&
          !semester &&
          !publishedYear &&
          !subjectId,
      },
    })

  const { data: searchPostsData, isLoading: isLoadingSearch } =
    useProjectsControllerFilterPosts({
      request: {
        params: apiParams,
      },
      query: {
        enabled: searchType === 'posts' && isFiltering,
      },
    })

  const { data: studentsData, isLoading: isLoadingStudents } =
    useUsersControllerFetchStudents(
      {
        name: searchQuery,
      },
      {
        query: {
          enabled: searchType === 'students',
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
                <FilterButton>
                  <ListFilter size={18} />
                  Filtros
                </FilterButton>
              </PopoverTrigger>

              <PopoverContent className="w-[300px] bg-deck-bg p-4">
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

          <ProjectColumn
            isLoading={isLoadingProjects}
            projects={col1Projects}
          />

          <ProjectColumn
            isLoading={isLoadingProjects}
            projects={col2Projects}
            header={
              <div className="h-[201px] w-[332px]">
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
            isLoading={isLoadingProjects}
            projects={col3Projects}
          />
        </>
      )}

      {students && searchType === 'students' && (
        <div className="flex flex-col gap-5 pt-5">
          {isLoadingStudents
            ? [1, 2, 3].map(skeleton => (
                <Skeleton key={skeleton} className="h-[495px] w-[332px]" />
              ))
            : students.map(student => (
                <Link
                  href={`/projects/profile/${student.username}`}
                  key={student.id}
                >
                  <StudentCard {...student} />
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

export default function Search() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  )
}
