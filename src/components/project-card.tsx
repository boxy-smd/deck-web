import { Badge } from '@/components/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

import { cn } from '@/lib/utils'
import type { ElementType } from 'react'
import { Audiovisual } from './assets/audiovisual'
import { Design } from './assets/design'
import { Games } from './assets/games'
import { SMD } from './assets/smd'
import { Systems } from './assets/systems'

const trailsIcons: Record<
  string,
  [ElementType, string, string, string, string]
> = {
  Design: [
    Design,
    '#D41919',
    cn('bg-deck-red'),
    cn('bg-deck-red-light'),
    cn('text-deck-red-dark'),
  ],
  Sistemas: [
    Systems,
    '#0581C4',
    cn('bg-deck-blue'),
    cn('bg-deck-blue-light'),
    cn('text-deck-blue-dark'),
  ],
  Audiovisual: [
    Audiovisual,
    '#E99700',
    cn('bg-deck-orange'),
    cn('bg-deck-orange-light'),
    cn('text-deck-orange-dark'),
  ],
  Jogos: [
    Games,
    '#5BAD5E',
    cn('bg-deck-green'),
    cn('bg-deck-green-light'),
    cn('text-deck-green-dark'),
  ],
  SMD: [
    SMD,
    '#8B00D0',
    cn('bg-deck-purple'),
    cn('bg-deck-purple-light'),
    cn('text-deck-purple-dark'),
  ],
}

export type ProjectCardProps = {
  title: string
  author: string
  description: string
  professors?: string[]
  bannerUrl: string
  publishedYear: number
  semester: number
  subject?: string
  trails: string[]
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
  trails,
}: ProjectCardProps) {
  const [Icon, color, bgColor, bgLightColor, textColor] =
    trails.length > 1 ? trailsIcons.SMD : trailsIcons[trails[0]]

  return (
    <div className="relative h-[496px] w-[332px] rounded-xl border-2 border-deck-border bg-deck-bg p-5">
      <div
        className={cn(
          'absolute top-0 left-0 z-10 flex size-14 items-center justify-center rounded-full border-8 border-deck-bg p-1',
          bgColor,
        )}
      >
        <Icon className="size-10" innerColor={'#fff'} foregroundColor={color} />
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
            <Badge
              className={cn(
                'h-[27px] max-w-[130px] truncate rounded-[18px] px-3 py-[6px] text-xs',
                bgLightColor,
                textColor,
              )}
            >
              <span className="w-full truncate">{subject}</span>
            </Badge>

            <Badge
              className={cn(
                'mx-3 h-[27px] max-w-[130px] truncate rounded-[18px] px-3 py-[6px] text-xs',
                bgLightColor,
                textColor,
              )}
            >
              {`${semester}º Sem.`}
            </Badge>

            <Badge
              className={cn(
                'h-[27px] max-w-[130px] truncate rounded-[18px] px-3 py-[6px] text-xs',
                bgLightColor,
                textColor,
              )}
            >
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
