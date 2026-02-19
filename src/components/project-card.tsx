import { Badge } from '@/components/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import type { Professor } from '@/entities/professor'
import type { Trail } from '@/entities/trail'
import { getTrailConfigFromArray } from '@/lib/trails-config'
import { cn } from '@/lib/utils'

export type ProjectCardProps = {
  title: string
  author: string
  description: string
  professors?: Professor[]
  bannerUrl?: string
  publishedYear: number
  semester: number
  subject?: string
  trails: Trail[]
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
  const {
    icon: Icon,
    color,
    bgDarkColor,
    bgColor,
    textColor,
  } = getTrailConfigFromArray(trails)

  return (
    <div className="relative h-[496px] w-[332px] rounded-xl border-2 border-deck-border bg-deck-bg p-5">
      <div
        className={cn(
          'absolute top-0 left-0 z-10 flex size-14 items-center justify-center rounded-full border-8 border-deck-bg p-1',
          bgDarkColor,
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

          <h1 className="my-3 font-semibold text-deck-darkest text-xl leading-6">
            {title}
          </h1>

          <p className="text-deck-secondary-text text-xs">
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
            {subject && (
              <Badge
                className={cn(
                  'h-[27px] max-w-[130px] truncate rounded-[18px] px-3 py-[6px] text-xs',
                  bgColor,
                  textColor,
                )}
              >
                <span className="w-full truncate">{subject}</span>
              </Badge>
            )}

            <Badge
              className={cn(
                'mx-3 h-[27px] max-w-[130px] truncate rounded-[18px] px-3 py-[6px] text-xs',
                bgColor,
                textColor,
              )}
            >
              {`${semester}º Sem.`}
            </Badge>

            <Badge
              className={cn(
                'h-[27px] max-w-[130px] truncate rounded-[18px] px-3 py-[6px] text-xs',
                bgColor,
                textColor,
              )}
            >
              {publishedYear}
            </Badge>
          </div>

          <p className="line-clamp-none pt-3 text-deck-secondary-text text-sm leading-4">
            {description}
          </p>
        </div>

        {professors && (
          <div className="flex items-center gap-3">
            {professors.map(professor => (
              <p
                key={professor.id}
                className="text-deck-secondary-text text-xs"
              >
                {professor.name}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
