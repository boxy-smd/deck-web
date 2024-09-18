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
import { Skeleton } from '@/components/ui/skeleton' // Importando o componente Skeleton
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Post } from '@/entities/project'
import { instance } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'

const generateId = () => Math.random().toString(36).substring(2, 9)

const trails = [
  {
    id: generateId(),
    value: 'design',
    label: 'Design',
  },
  {
    id: generateId(),
    value: 'sistemas',
    label: 'Sistemas',
  },
  {
    id: generateId(),
    value: 'audiovisual',
    label: 'Audiovisual',
  },
  {
    id: generateId(),
    value: 'jogos',
    label: 'Jogos',
  },
]

export default function Home() {
  const [selectedTrails, setSelectedTrails] = useState<string[]>([])
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const fetchPosts = useCallback(async () => {
    const { data } = await instance.get('/projects')
    return data.posts
  }, [])

  const { data: projects, isLoading } = useQuery<Post[]>({
    queryKey: ['posts', selectedTrails, 'filter'],
    queryFn: fetchPosts,
  })

  function toggleTrail(trail: string) {
    if (selectedTrails.includes(trail)) {
      setSelectedTrails(selectedTrails.filter(item => item !== trail))
    } else {
      setSelectedTrails([...selectedTrails, trail])
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

  const col1Projects = projects?.filter((_, index) => index % 3 === 0)
  const col2Projects = projects?.filter((_, index) => index % 3 === 1)
  const col3Projects = projects?.filter((_, index) => index % 3 === 2)

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
                onClick={() => toggleTrail(option.value)}
                key={option.value}
                value={option.value}
                variant={
                  selectedTrails.includes(option.value) ? 'added' : 'default'
                }
                className="gap-2"
              >
                <Image className="size-[18px]" />
                {option.label}
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
            <Filter />
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
