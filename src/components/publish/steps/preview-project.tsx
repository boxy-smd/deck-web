'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { InlineErrorNotice } from '@/components/ui/inline-error-notice'
import { Switch } from '@/components/ui/switch'
import { useTagsDependencies } from '@/contexts/hooks/use-tags-dependencies'
import type { CreateProjectFormSchema } from '@/hooks/project/use-publish-project'
import { ProjectCard, type ProjectCardProps } from '../../project-card'

interface PreviewProjectStepProps extends Omit<ProjectCardProps, 'trails'> {
  onSaveDraft(): void
  onPublish(): void
  isSavingDraft: boolean
  isPublishing: boolean
  requestError?: string | null
  onDismissRequestError?(): void
}

export function PreviewProjectStep({
  title,
  author,
  description,
  professors,
  bannerUrl,
  publishedYear,
  semester,
  subject,
  onSaveDraft,
  isSavingDraft,
  onPublish,
  isPublishing,
  requestError,
  onDismissRequestError,
}: PreviewProjectStepProps) {
  const { trails } = useTagsDependencies()
  const { setValue, getValues, watch } = useFormContext<CreateProjectFormSchema>()

  const selectedTrails = trails.data?.filter(trail =>
    getValues('trailsIds')?.includes(trail.id),
  )

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-2 pb-6 sm:px-3 lg:px-0 lg:pb-0">
      <div className="flex w-full max-w-[860px] justify-center py-2">
        <ProjectCard
          bannerUrl={bannerUrl}
          title={title}
          author={author}
          publishedYear={publishedYear}
          semester={semester}
          subject={subject}
          description={description}
          professors={professors}
          trails={selectedTrails || []}
        />
      </div>

      <div className="mt-6 flex w-full max-w-[860px] flex-col-reverse justify-end gap-2 sm:flex-row lg:mt-10">
        {requestError && (
          <InlineErrorNotice
            message={requestError}
            onDismiss={onDismissRequestError}
            className="mr-auto"
          />
        )}

        <Button
          type="button"
          onClick={onSaveDraft}
          size="sm"
          disabled={isSavingDraft}
          className="w-full sm:w-auto"
        >
          {isSavingDraft ? 'Salvando...' : 'Salvar Rascunho'}
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="dark"
              type="button"
              size="sm"
              className="w-full sm:w-auto"
            >
              Avançar
            </Button>
          </DialogTrigger>

          <DialogContent className="w-[calc(100vw-1rem)] max-w-lg p-5 sm:w-full sm:p-6">
            <DialogHeader>
              <DialogTitle>Controle dos comentários</DialogTitle>

              <DialogDescription>
                Caso habilitado, apenas outros alunos poderão comentar e
                visualizar comentários em seu projeto.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2">
              <Switch
                checked={watch('allowComments')}
                onCheckedChange={value => setValue('allowComments', value)}
                id="allowComments"
              />
              <label
                htmlFor="allowComments"
                className="cursor-pointer font-medium text-slate-700"
              >
                Habilitar Comentários
              </label>
            </div>

            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
              <Button
                onClick={() => setIsDialogOpen(false)}
                type="button"
                size="sm"
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>

              <Button
                onClick={onPublish}
                disabled={isPublishing}
                variant="dark"
                size="sm"
                type="button"
                className="w-full sm:w-auto"
              >
                {isPublishing ? 'Publicando...' : 'Publicar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
