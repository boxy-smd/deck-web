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
  maxAccessibleStep: number
  onPreviousStep(): void
  onStep(step: number): void
  onSaveDraft(): void
  isSavingDraft: boolean
  hasProjectTitle: boolean
}

export function PublishProjectFormSidebar({
  currentStep,
  maxAccessibleStep,
  onPreviousStep,
  onStep,
  onSaveDraft,
  isSavingDraft,
  hasProjectTitle,
}: PublishProjectFormSidebarProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const steps = ['Cadastrar', 'Documentar', 'Revisar']

  return (
    <aside className="top-0 left-0 z-10 flex w-full flex-col items-start justify-start bg-deck-clear-tone lg:fixed lg:h-full lg:w-fit lg:min-w-75">
      {currentStep === 3 && (
        <Button
          onClick={onPreviousStep}
          className="absolute top-3 left-3 size-9 bg-transparent lg:top-5 lg:left-5 lg:size-10"
          size="icon"
        >
          <ChevronLeft className="size-7" />
        </Button>
      )}

      {currentStep < 3 && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="absolute top-3 left-3 size-9 bg-transparent lg:top-5 lg:left-5 lg:size-10"
              size="icon"
            >
              <X className="size-7" />{' '}
            </Button>
          </DialogTrigger>

          <DialogContent className="w-[calc(100vw-1rem)] max-w-lg gap-4 p-5 sm:w-full sm:p-6">
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

            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
              <Button
                onClick={() => {
                  router.push('/')
                }}
                type="button"
                size="sm"
                className="w-full text-deck-darkest sm:w-auto"
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
                disabled={hasProjectTitle && isSavingDraft}
                type="button"
                variant="dark"
                size="sm"
                className="w-full text-deck-bg sm:w-auto"
              >
                {hasProjectTitle
                  ? isSavingDraft
                    ? 'Salvando...'
                    : 'Salvar Rascunho'
                  : 'Voltar ao Editor'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="mt-14 flex w-full flex-row items-start justify-start gap-2 overflow-x-auto px-3 py-3 lg:mt-40 lg:flex-col lg:gap-8 lg:overflow-visible lg:px-0 lg:py-0">
        {steps.map((step, i) => (
          <button
            key={step}
            onClick={() => onStep(i + 1)}
            disabled={i + 1 > maxAccessibleStep}
            aria-current={i + 1 === currentStep ? 'step' : undefined}
            aria-disabled={i + 1 > maxAccessibleStep}
            className={cn(
              'relative flex min-w-fit flex-row items-center justify-start gap-3 rounded-md px-3 py-2 text-left transition-colors lg:w-full lg:gap-5 lg:px-16 lg:py-1',
              i + 1 > maxAccessibleStep
                ? 'cursor-not-allowed opacity-70'
                : 'hover:bg-deck-bg-hover/50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-deck-darkest/30',
            )}
            type="button"
          >
            <div
              className={cn(
                'relative z-10 flex size-10 items-center justify-center rounded-full border-2 border-deck-secondary-text bg-transparent font-semibold text-deck-secondary-text',
                i + 1 < currentStep &&
                  'border-deck-darkest bg-deck-darkest text-deck-bg',
                i + 1 === currentStep &&
                  'border-deck-darkest bg-deck-darkest text-deck-bg',
              )}
            >
              {i + 1 < currentStep ? (
                <Check className="size-4.5" />
              ) : (
                <span className="number">{i + 1}</span>
              )}
            </div>

            <div className="text-left">
              <div className="text-[10px] text-deck-secondary-text uppercase lg:text-xs">
                Passo {i + 1}
              </div>

              <p
                className={cn(
                  'font-medium text-[13px] text-deck-darkest lg:text-base',
                  i + 1 === currentStep && 'text-deck-dark',
                )}
              >
                {step}
              </p>
            </div>

            {i < 2 && (
              <div
                className={cn(
                  'absolute top-11 left-20.75 hidden h-10 w-0 border-deck-secondary-text border-l-2 lg:block',
                  i + 1 < currentStep && 'border-deck-darkest',
                )}
              />
            )}
          </button>
        ))}
      </div>
    </aside>
  )
}
