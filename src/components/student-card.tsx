import { User2 } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import type { Student } from '@/entities/student'
import { getTrailConfig } from '@/lib/trails-config'
import { cn } from '@/lib/utils'

export function StudentCard({
  name,
  username,
  semester,
  profileUrl,
  trails,
}: Student) {
  return (
    <div className="w-full rounded-xl border-2 border-slate-200 p-4 lg:p-5">
      <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap lg:gap-0">
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
        <div className="min-w-0 lg:ml-4">
          <h2 className="font-semibold text-slate-700 text-xl">{name}</h2>
          <div className="flex flex-wrap items-center gap-2 text-sm lg:gap-4">
            <p className="truncate">@{username}</p>
            <span className="hidden lg:inline">•</span>
            <p>{semester ?? 0}º Semestre</p>
          </div>
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap items-center gap-2.5 lg:mt-0 lg:gap-4">
        {trails.map(trail => {
          const {
            icon: Icon,
            color,
            textColor,
            bgColor,
          } = getTrailConfig(trail.name, trail)

          return (
            <li key={trail.id}>
              <Badge
                className={cn(
                  'truncate rounded-[18px] px-3 py-[6px] text-sm hover:bg-opacity-100 lg:mt-7',
                  bgColor,
                  textColor,
                )}
              >
                <Icon
                  className="size-[18px]"
                  innerColor={color}
                  foregroundColor="transparent"
                />

                {trail.name}
              </Badge>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
