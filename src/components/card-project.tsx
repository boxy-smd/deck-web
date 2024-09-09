import { Zap } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

type CardProjectProps = {
  title: string
  author: string
  tags: string[]
  description: string
  professor: string
}

export function CardProject({
  title,
  author,
  tags,
  description,
  professor,
}: CardProjectProps) {
  return (
    <div className="relative min-h-[496px] max-w-[332px] rounded-xl border-2 border-slate-400 bg-slate-50 p-5">
      <div className="absolute top-0 left-0 z-10 flex h-[54px] w-[54px] items-center justify-center rounded-full border-8 border-slate-50 bg-slate-400 p-1">
        <Zap color="#fff" className="h-6 w-6" />
      </div>
      <div className="relative flex h-[403px] w-[292px] flex-col">
        <div className="min-h-[180px] w-[292px] bg-slate-600" />

        <h1 className="pt-3 font-semibold text-xl leading-6">{title}</h1>

        <p className="pt-3 text-slate-600 text-xs">
          Feito por{' '}
          <HoverCard>
            <HoverCardTrigger className="underline">{author}</HoverCardTrigger>
            <HoverCardContent>
              Esse trabalho foi realizado por {author} em {tags[2]} no {tags[1]}
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
        <p className="line-clamp-none pt-3 text-slate-600 text-sm">
          {description}
        </p>
      </div>
      <p className="pt-[37px] text-slate-600 text-xs">{professor}</p>
    </div>
  )
}
