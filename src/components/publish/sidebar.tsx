'use client'

import { Check, ChevronLeft, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
import { cn } from '@/lib/utils'

interface PublishProjectFormSidebarProps {
  currentStep: number
  onPreviousStep(): void
  onStep(step: number): void
  onSaveDraft(): void
  hasProjectTitle: boolean
}

export function PublishProjectFormSidebar({
  currentStep,
  onPreviousStep,
  onStep,
  onSaveDraft,
  hasProjectTitle,
}: PublishProjectFormSidebarProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const steps = ['Cadastrar', 'Documentar', 'Revisar']

  return (
    <aside className="fixed top-0 left-0 z-10 flex h-full w-fit min-w-[300px] flex-col items-start justify-start bg-slate-200">
      {currentStep === 3 && (
        <Button
          onClick={onPreviousStep}
          className="absolute top-5 left-5 size-10 bg-transparent"
          size="icon"
        >
          <ChevronLeft className="size-7" />
        </Button>
      )}

      {currentStep < 3 && (
        <Dialog open={isDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="absolute top-5 left-5 size-10 bg-transparent"
              size="icon"
            >
              <X className="size-7" />{' '}
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {hasProjectTitle
                  ? 'Seu projeto ainda não foi salvo!'
                  : 'Preencha o Título'}
              </DialogTitle>

              <DialogDescription>
                {hasProjectTitle
                  ? 'Se você sair agora, todo o progresso será perdido. Deseja salvar seu rascunho antes de sair?'
                  : 'Se você sair agora, todo o progresso feito até aqui será perdido.'}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                onClick={() => {
                  router.push('/')
                }}
                type="button"
                size="sm"
              >
                Sair mesmo assim
              </Button>

              <Button
                onClick={() => {
                  if (hasProjectTitle) {
                    onSaveDraft()
                  }

                  setIsDialogOpen(false)
                }}
                type="submit"
                variant="dark"
                size="sm"
              >
                {hasProjectTitle ? 'Salvar Rascunho' : 'Voltar ao Editor'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="mt-40 flex flex-col items-start justify-start gap-8">
        {steps.map((step, i) => (
          <button
            key={step}
            onClick={() => onStep(i + 1)}
            disabled={i + 1 > currentStep}
            className="relative flex w-full flex-row items-center justify-start gap-5 px-16"
            type="button"
          >
            <div
              className={cn(
                'relative z-10 flex size-10 items-center justify-center rounded-full border-2 border-slate-400 bg-slate-200 font-semibold text-slate-400',
                i + 1 < currentStep &&
                  'border-slate-600 bg-slate-600 text-slate-50',
                i + 1 === currentStep &&
                  'border-slate-700 bg-slate-700 text-slate-50',
              )}
            >
              {i + 1 < currentStep ? (
                <Check className="size-[18px]" />
              ) : (
                <span className="number">{i + 1}</span>
              )}
            </div>

            <div className="text-left">
              <div className="text-slate-500 text-xs uppercase">
                Passo {i + 1}
              </div>

              <p className="font-medium text-slate-900">{step}</p>
            </div>

            {i < 2 && (
              <div
                className={cn(
                  'absolute top-[41px] left-[82px] block h-[30px] border-2 border-slate-400',
                  i + 1 < currentStep && 'border-slate-600',
                )}
              />
            )}
          </button>
        ))}
      </div>
    </aside>
  )
}
