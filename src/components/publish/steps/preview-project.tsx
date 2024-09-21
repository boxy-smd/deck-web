import type { CreateProjectFormSchema } from '@/app/project/[projectId]/edit/page'
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
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ProjectCard, type ProjectCardProps } from '../../project-card'

interface PreviewProjectStepProps extends ProjectCardProps {
  onSaveDraft(): void
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
}: PreviewProjectStepProps) {
  const { register } = useFormContext<CreateProjectFormSchema>()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-[52px]">
      <div className="flex h-[716px] w-full max-w-[1036px] items-center justify-center gap-5">
        <div className="flex h-full w-full flex-col items-center justify-center gap-5">
          <div className="h-full w-[332px] rounded-b-xl bg-gradient-to-t from-slate-100 to-slate-200" />
          <div className="h-full w-[332px] rounded-t-xl bg-gradient-to-t from-slate-100 to-slate-200" />
        </div>

        <div className="flex h-full w-full flex-col items-center justify-center gap-5">
          <div className="h-[90px] w-full rounded-b-xl bg-gradient-to-t from-slate-100 to-slate-200" />

          <ProjectCard
            bannerUrl={bannerUrl}
            title={title}
            author={author}
            publishedYear={publishedYear}
            semester={semester}
            subject={subject}
            description={description}
            professors={professors}
          />

          <div className="h-[90px] w-full rounded-t-xl bg-gradient-to-t from-slate-100 to-slate-200" />
        </div>

        <div className="flex h-full w-full flex-col items-center justify-center gap-5">
          <div className="h-full w-[332px] rounded-xl bg-gradient-to-t from-slate-100 to-slate-200" />
          <div className="h-full w-[332px] rounded-xl bg-gradient-to-t from-slate-100 to-slate-200" />
        </div>
      </div>

      <div className="mt-10 mr-[88px] flex w-full flex-row justify-end gap-2">
        <Button type="button" onClick={onSaveDraft} size="sm">
          Salvar Rascunho
        </Button>

        <Dialog open={isDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="dark"
              type="button"
              size="sm"
            >
              Avançar
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Controle dos comentários</DialogTitle>

              <DialogDescription>
                Caso habilitado, apenas outros alunos poderão comentar e
                visualizar comentários em seu projeto.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2">
              <Switch id="allowComments" {...register('allowComments')} />
              <label
                htmlFor="allowComments"
                className="cursor-pointer font-medium text-slate-700"
              >
                Habilitar Comentários
              </label>
            </div>

            <DialogFooter>
              <Button
                onClick={() => setIsDialogOpen(false)}
                type="button"
                size="sm"
              >
                Cancelar
              </Button>

              <Button type="submit" variant="dark" size="sm">
                Publicar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
