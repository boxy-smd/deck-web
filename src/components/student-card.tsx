import { Badge } from '@/components/ui/badge'
import type { Student } from '@/entities/student'
import { User2 } from 'lucide-react'

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
          <img
            src={profileUrl}
            alt={`${name}'s profile`}
            className="h-[72px] w-[72px] rounded-full object-cover"
          />
        ) : (
          <div className="flex size-[72px] items-center justify-center rounded-full bg-slate-300">
            <User2 className="size-10 text-slate-700" />
          </div>
        )}
        <div className="ml-4 ">
          <h2 className="font-semibold text-slate-700 text-xl">{name}</h2>
          <div className="flex gap-4">
            <p>@{username}</p>
            <span>•</span>
            <p>{semester}º Semestre</p>
          </div>
        </div>
      </div>

      <ul className="flex items-center gap-4">
        {trails.map(trail => (
          <li key={trail}>
            <Badge className="mt-7 truncate rounded-[18px] bg-slate-200 px-3 py-[6px] text-slate-900 text-sm hover:text-slate-50">
              {trail}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  )
}
