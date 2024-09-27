'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Image } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
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
import { EditProfileModal } from './modal-profile'

type ProfileCardProps = Omit<Profile, 'posts' | 'drafts'>

const editProfileModalSchema = z.object({
  semester: z.number(),
  trails: z.array(z.string()),
  about: z.string(),
  profileImage: z.instanceof(File).optional(),
})

export type EditProfileModalSchema = z.infer<typeof editProfileModalSchema>

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
    },
  })

  return (
    <div className="flex h-[496px] w-[332px] flex-shrink-0 flex-col items-center justify-between rounded-xl border-2 border-slate-200 bg-deck-bg p-5">
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
