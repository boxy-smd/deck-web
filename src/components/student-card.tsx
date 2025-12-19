import { User2 } from 'lucide-react'
import Image from 'next/image'
import type { ElementType } from 'react'
import { Badge } from '@/components/ui/badge'
import type { Student } from '@/entities/student'
import { cn } from '@/lib/utils'
import { Audiovisual } from './assets/audiovisual'
import { Design } from './assets/design'
import { Games } from './assets/games'
import { Systems } from './assets/systems'

const trailsIcons: Record<string, [ElementType, string, string, string]> = {
  Design: [
    Design,
    '#D41919',
    cn('text-deck-red-dark'),
    cn('bg-deck-red-light hover:bg-deck-red-light'),
  ],
  Sistemas: [
    Systems,
    '#0581C4',
    cn('text-deck-blue-dark'),
    cn('bg-deck-blue-light hover:bg-deck-blue-light'),
  ],
  Audiovisual: [
    Audiovisual,
    '#E99700',
    cn('text-deck-orange-dark'),
    cn('bg-deck-orange-light hover:bg-deck-orange-light'),
  ],
  Jogos: [
    Games,
    '#5BAD5E',
    cn('text-deck-green-dark'),
    cn('bg-deck-green-light hover:bg-deck-green-light'),
  ],
}

export function StudentCard({
  name,
  username,
  semester,
  profileUrl,
  trails,
}: Student) {
  return (
    <div className="w-[1036px] border-2 border-slate-200 p-5">
      <div className="flex items-center">
        {profileUrl ? (
          <Image
            src={profileUrl}
            alt={`${name}'s profile`}
            className="h-[72px] w-[72px] rounded-full object-cover"
            width={72}
            height={72}
          />
        ) : (
          <div className="flex size-[72px] items-center justify-center rounded-full bg-slate-300">
            <User2 className="size-10 text-slate-700" />
          </div>
        )}
        <div className="ml-4">
          <h2 className="font-semibold text-slate-700 text-xl">{name}</h2>
          <div className="flex gap-4">
            <p>@{username}</p>
            <span>•</span>
            <p>{semester}º Semestre</p>
          </div>
        </div>
      </div>

      <ul className="flex items-center gap-4">
        {trails.map(trail => {
          const [Icon, color, textColor, bgColor] = trailsIcons[trail]

          return (
            <li key={trail}>
              <Badge
                className={cn(
                  'mt-7 truncate rounded-[18px] px-3 py-[6px] text-sm',
                  bgColor,
                  textColor,
                )}
              >
                <Icon
                  className="size-[18px]"
                  innerColor={color}
                  foregroundColor="transparent"
                />

                {trail}
              </Badge>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
