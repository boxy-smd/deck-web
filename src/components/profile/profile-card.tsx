'use client'

import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card'
import { Image } from 'lucide-react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { useLoggedStudent } from '@/contexts/hooks/use-logged-student'
import type { Profile } from '@/entities/profile'
import { Modal } from './modal-profile'

type ProjectCardProps = Omit<Profile, 'posts'>

export function ProfileCard({
  id,
  name,
  username,
  semester,
  about,
  profileUrl,
  trails,
}: ProjectCardProps) {
  const { student } = useLoggedStudent()

  return (
    <div className="flex h-[496px] w-[332px] flex-shrink-0 flex-col items-center justify-between rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            {profileUrl ? (
              <img
                src={profileUrl}
                alt={name}
                className="size-[72px] rounded-full"
              />
            ) : (
              <div className="size-[72px] rounded-full bg-slate-600" />
            )}

            <div className="flex flex-col justify-center gap-1">
              <strong className="font-semibold text-slate-700 text-xl">
                {name}
              </strong>

              <p className="text-slate-600 text-sm">
                <HoverCard>
                  <HoverCardTrigger>
                    {`@${username}`} • {`${semester}º semestre`}
                  </HoverCardTrigger>
                </HoverCard>
              </p>
            </div>
          </div>

          <div className="pt-7">
            <div className="flex flex-wrap gap-2">
              {trails.map(trail => (
                <Badge
                  key={trail}
                  className="truncate rounded-[18px] bg-slate-200 px-3 py-1.5 text-slate-900 text-sm"
                >
                  <Image className="size-[18px]" />
                  {trail}
                </Badge>
              ))}
            </div>
          </div>

          <p className="pt-5 font-normal text-base text-slate-700 leading-5">
            {about}
          </p>
        </div>
      </div>

      {student?.id === id && (
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="mb-3 w-full">
                Editar Perfil
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[420px] p-0">
              <Modal />

              <DialogFooter className="sm:justify -start mb-3">
                <DialogClose asChild>
                  <Button type="button" className="mx-[36px] mb-10 w-full">
                    Concluir
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="dark" className="w-full">
            Exportar Portfólio
          </Button>
        </div>
      )}
    </div>
  )
}
