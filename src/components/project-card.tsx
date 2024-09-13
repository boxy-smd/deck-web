'use client'

'use client'

import { Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

export type ProjectCardProps = {
  id: string
  title: string
  author: string
  tags: string[]
  description: string
  professor: string
}

export function ProjectCard({
  id,
  title,
  author,
  tags,
  description,
  professor,
}: ProjectCardProps) {
  const router = useRouter()

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      onClick={() => router.push(`/project/${id}`)}
      className="relative h-[496px] w-[332px] cursor-pointer rounded-xl border-2 border-slate-400 bg-slate-50 p-5"
    >
      <div className="absolute top-0 left-0 z-10 flex size-14 items-center justify-center rounded-full border-8 border-slate-50 bg-slate-400 p-1">
        <Zap className="size-6 text-slate-100" />
      </div>

      <div className="flex h-full w-full flex-col items-start justify-between">
        <div className="relative flex h-[403px] w-[292px] flex-col">
          <div className="h-[180px] w-full bg-slate-600" />

          <h1 className="my-3 font-semibold text-slate-700 text-xl leading-6">
            {title}
          </h1>

          <p className="text-slate-600 text-xs">
            Feito por{' '}
            <HoverCard>
              <HoverCardTrigger className="underline">
                {author}
              </HoverCardTrigger>

              <HoverCardContent>
                Esse trabalho foi realizado por {author} em {tags[2]} no{' '}
                {tags[1]}
              </HoverCardContent>
            </HoverCard>
          </p>

          <div className="pt-3">
            <Badge className="h-[27px] max-w-[130px] truncate rounded-[18px] bg-slate-200 px-3 py-[6px] text-slate-900 text-xs hover:text-slate-50">
              <span className="w-full truncate">{tags[0]}</span>
            </Badge>

            <Badge className="mx-3 h-[27px] w-[70px] truncate rounded-[18px] bg-slate-200 px-3 py-[6px] text-slate-900 text-xs hover:text-slate-50">
              {tags[1]}
            </Badge>

            <Badge className="h-[27px] w-[55px] truncate rounded-[18px] bg-slate-200 px-3 py-[6px] text-slate-900 text-xs hover:text-slate-50">
              {tags[2]}
            </Badge>
          </div>

          <p className="line-clamp-none pt-3 text-slate-600 text-sm leading-4">
            {description}
          </p>
        </div>

        <p className="text-slate-600 text-xs">{professor}</p>
      </div>
    </div>
  )
}
