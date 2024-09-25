import { Zap } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

export type ProjectCardProps = {
  title: string
  author: string
  description: string
  professors?: string[]
  bannerUrl: string
  publishedYear: number
  semester: number
  subject?: string
}

export function ProjectCard({
  title,
  author,
  description,
  professors,
  bannerUrl,
  publishedYear,
  semester,
  subject,
}: ProjectCardProps) {
  return (
    <div className="relative h-[496px] w-[332px] rounded-xl border-2 border-slate-400 bg-slate-50 p-5">
      <div className="absolute top-0 left-0 z-10 flex size-14 items-center justify-center rounded-full border-8 border-slate-50 bg-slate-400 p-1">
        <Zap className="size-6 text-slate-100" />
      </div>

      <div className="flex h-full w-full flex-col items-start justify-between">
        <div className="relative flex h-[403px] w-[292px] flex-col">
          <div
            className="h-[180px] w-full bg-slate-600"
            style={{
              backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <h1 className="my-3 font-semibold text-slate-700 text-xl leading-6">
            {title}
          </h1>

          <p className="text-slate-600 text-xs">
            Feito por{' '}
            <HoverCard>
              <HoverCardTrigger asChild className="inline underline">
                <span>{author}</span>
              </HoverCardTrigger>

              <HoverCardContent>
                Esse trabalho foi realizado por {author} em {publishedYear} no{' '}
                {`${semester}º semestre`}
              </HoverCardContent>
            </HoverCard>
          </p>

          <div className="pt-3">
            <Badge className="h-[27px] max-w-[130px] truncate rounded-[18px] bg-slate-200 px-3 py-[6px] text-slate-900 text-xs">
              <span className="w-full truncate">{subject}</span>
            </Badge>

            <Badge className="mx-3 h-[27px] w-[70px] truncate rounded-[18px] bg-slate-200 px-3 py-[6px] text-slate-900 text-xs">
              {`${semester}º Sem.`}
            </Badge>

            <Badge className="h-[27px] w-[55px] truncate rounded-[18px] bg-slate-200 px-3 py-[6px] text-slate-900 text-xs">
              {publishedYear}
            </Badge>
          </div>

          <p className="line-clamp-none pt-3 text-slate-600 text-sm leading-4">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {professors?.map(professor => (
            <p key={`${professor}`} className="text-slate-600 text-xs">
              {`${professor.split(' ')[0]} ${professor.split(' ')[1]} ${professor.split(' ')[2][0]}.`}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
