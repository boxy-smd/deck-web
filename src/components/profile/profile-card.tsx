'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { type ElementType, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card'
import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'
import { useTagsDependencies } from '@/contexts/hooks/use-tags-dependencies'
import type { Profile } from '@/entities/profile'
import { editProfile, uploadProfileImage } from '@/functions/students'
import { queryClient } from '@/lib/tanstack-query/client'
import { cn } from '@/lib/utils'
import { Audiovisual } from '../assets/audiovisual'
import { Design } from '../assets/design'
import { Games } from '../assets/games'
import { Systems } from '../assets/systems'
import { EditProfileModal } from './modal-profile'

type ProfileCardProps = Omit<Profile, 'posts' | 'drafts'>

const editProfileModalSchema = z.object({
  semester: z.number(),
  trails: z.array(z.string()),
  about: z.string(),
  profileImage: z.instanceof(File).optional(),
})

export type EditProfileModalSchema = z.infer<typeof editProfileModalSchema>

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

export function ProfileCard({
  id,
  name,
  username,
  semester,
  about,
  profileUrl,
  trails,
}: ProfileCardProps) {
  const { trails: trailsToChoice } = useTagsDependencies()
  const { student } = useAuthenticatedStudent()

  const methods = useForm<EditProfileModalSchema>({
    resolver: zodResolver(editProfileModalSchema),
    defaultValues: {
      semester,
      trails,
      about,
    },
  })

  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false)

  async function handleUpdateProfile(data: EditProfileModalSchema) {
    const trailsIds =
      trailsToChoice.data
        ?.filter(trail => data.trails.includes(trail.name))
        .map(trail => trail.id) || []

    await editProfile(id, data, trailsIds)

    if (data.profileImage) {
      const profileImage = new File([data.profileImage], username)
      await uploadProfileImage(profileImage, username)
    }

    setIsEditProfileDialogOpen(false)
  }

  const editProfileMutation = useMutation({
    mutationFn: handleUpdateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile', username],
      })
      queryClient.invalidateQueries({
        queryKey: ['students', 'me'],
      })
    },
  })

  return (
    <div className="flex h-[496px] w-[332px] flex-shrink-0 flex-col items-center justify-between rounded-xl border-2 border-slate-200 bg-deck-bg p-5">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            {profileUrl ? (
              <Image
                src={profileUrl}
                alt={name}
                className="size-[72px] rounded-full"
                width={72}
                height={72}
              />
            ) : (
              <div className="size-[72px] rounded-full bg-slate-600" />
            )}

            <div className="flex flex-col justify-center gap-1">
              <strong className="font-semibold text-slate-700 text-xl">
                {name}
              </strong>

              <p className="text-deck-secondary-text text-sm">
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
              {trails.map(trail => {
                const [Icon, color, textColor, bgColor] = trailsIcons[trail]

                return (
                  <Badge
                    className={cn(
                      'truncate rounded-[18px] px-3 py-[6px] text-sm',
                      bgColor,
                      textColor,
                    )}
                    key={trail}
                  >
                    <Icon
                      className="size-[18px]"
                      innerColor={color}
                      foregroundColor="transparent"
                    />

                    {trail}
                  </Badge>
                )
              })}
            </div>
          </div>

          <p className="pt-5 font-normal text-base text-slate-700 leading-5">
            {about}
          </p>
        </div>
      </div>

      {student.data && student.data.id === id && (
        <div>
          <FormProvider {...methods}>
            <Dialog open={isEditProfileDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setIsEditProfileDialogOpen(true)}
                  variant="default"
                  className="mb-3 w-full"
                >
                  Editar Perfil
                </Button>
              </DialogTrigger>

              <DialogContent
                className="w-[420px] p-8 pt-9"
                aria-describedby="Editar Perfil"
              >
                <form
                  onSubmit={methods.handleSubmit(data =>
                    editProfileMutation.mutate(data),
                  )}
                >
                  <DialogTitle className="hidden">Editar Perfil</DialogTitle>

                  <EditProfileModal
                    semester={semester}
                    trails={trails}
                    profileUrl={profileUrl}
                  />

                  <DialogFooter>
                    <Button
                      className="mt-6 w-full"
                      disabled={!methods.formState.isValid}
                      variant="dark"
                      type="submit"
                    >
                      Concluir
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </FormProvider>

          <Button variant="dark" className="w-full" asChild>
            <Link href={`/portfolio/${username}`}>Exportar Portfólio</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
