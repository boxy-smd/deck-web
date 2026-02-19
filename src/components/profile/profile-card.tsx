'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
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
import {
  getUsersControllerGetMeQueryKey,
  getUsersControllerGetProfileQueryKey,
  useUsersControllerEditProfile,
  useUsersControllerUploadProfileImage,
} from '@/http/api'
import { queryClient } from '@/lib/tanstack-query/client'
import { getTrailConfig } from '@/lib/trails-config'
import { cn } from '@/lib/utils'
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
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      semester: semester ?? 0,
      trails: trails.map(trail => trail.name) || [],
      about: about || '',
    },
  })

  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { mutateAsync: editProfile } = useUsersControllerEditProfile()
  const { mutateAsync: uploadImage } = useUsersControllerUploadProfileImage()

  async function handleUpdateProfile(data: EditProfileModalSchema) {
    const trailsIds = trailsToChoice.data
      ? trailsToChoice.data
          .filter(trail => data.trails.includes(trail.name))
          .map(trail => trail.id)
      : undefined

    await editProfile({
      studentId: id,
      data: {
        about: data.about,
        semester: data.semester,
        trailsIds,
        // profileUrl is not in the form explicitly as a string for editing, usually handled by upload or ignored?
        // Legacy passed it inside 'data' but the schema only has 'profileImage' as File.
      },
    })

    if (data.profileImage) {
      // Legacy: new File([data.profileImage], username)
      // Orval: params: username, body: { file: Blob }
      await uploadImage({
        username: username,
        data: {
          file: data.profileImage,
        },
      })
    }
  }

  function getSubmitErrorMessage(error: unknown) {
    if (typeof error === 'string') {
      return error
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message)
    }

    return 'Nao foi possivel salvar as alteracoes. Tente novamente.'
  }

  const editProfileMutation = useMutation({
    mutationFn: handleUpdateProfile,
    onMutate: () => {
      setSubmitError(null)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUsersControllerGetProfileQueryKey(username),
      })
      queryClient.invalidateQueries({
        queryKey: getUsersControllerGetMeQueryKey(),
      })
      setIsEditProfileDialogOpen(false)
    },
    onError: error => {
      setSubmitError(getSubmitErrorMessage(error))
    },
  })

  return (
    <div className="flex h-124 w-83 shrink-0 flex-col items-center justify-between rounded-xl border-2 border-slate-200 bg-deck-bg p-5">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            {profileUrl ? (
              <Image
                src={profileUrl}
                alt={name}
                className="size-18 rounded-full"
                width={72}
                height={72}
              />
            ) : (
              <div className="size-18 rounded-full bg-slate-600" />
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
                const {
                  icon: Icon,
                  color,
                  textColor,
                  bgColor,
                } = getTrailConfig(trail.name, trail)

                return (
                  <Badge
                    className={cn(
                      'truncate rounded-[18px] px-3 py-1.5 text-sm',
                      bgColor,
                      textColor,
                    )}
                    key={trail.id}
                  >
                    <Icon
                      className="size-4.5"
                      innerColor={color}
                      foregroundColor="transparent"
                    />

                    {trail.name}
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
            <Dialog
              open={isEditProfileDialogOpen}
              onOpenChange={setIsEditProfileDialogOpen}
            >
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
                className="w-105 p-8 pt-9"
                aria-describedby="Editar Perfil"
              >
                <form
                  onSubmit={methods.handleSubmit(data =>
                    editProfileMutation.mutateAsync(data),
                  )}
                >
                  <DialogTitle className="hidden">Editar Perfil</DialogTitle>

                  <EditProfileModal
                    semester={semester ?? 0}
                    profileUrl={profileUrl || ''}
                  />

                  {submitError && (
                    <p className="mt-4 text-red-700 text-sm">{submitError}</p>
                  )}

                  <DialogFooter>
                    <Button
                      className="mt-6 w-full"
                      disabled={editProfileMutation.isPending}
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
        </div>
      )}
    </div>
  )
}
