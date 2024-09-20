'use client'

import { Check, ChevronLeft, X } from 'lucide-react'
import { useState } from 'react'

import { CreateProjectForm } from '@/components/create-project-form'
import { ProjectCardPreview } from '@/components/project-card-preview'
import { Button } from '@/components/ui/button'
import { Editor } from '@/components/ui/editor'
import { cn } from '@/lib/utils'

export type ProjectInfo = {
  title: string
  description: string
  bannerUrl: string
  content: string
  publishedYear: string
  status: string
  semester: string
  author: string
  subjectId: string
  trailsIds: string[]
  professorsIds: string[]
}

export default function ProjectPageEdit() {
  const [projectInfos, setProjectInfos] = useState<ProjectInfo | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const steps = ['Cadastrar', 'Documentar', 'Revisar']
  const [banner, setBanner] = useState<File>()

  function prevStep() {
    setCurrentStep(prev => prev - 1)
  }

  function nextStep() {
    setCurrentStep(prev => prev + 1)
    console.log(projectInfos)
  }

  function goToStep(step: number) {
    setCurrentStep(step)
  }

  function handlePrevious() {
    if (currentStep <= 2) {
      return console.log('saindo')
    }

    prevStep()
  }

  return (
    <div className="flex min-h-screen flex-row bg-slate-50">
      <aside className="fixed top-0 left-0 z-10 flex h-full w-fit min-w-[300px] flex-col items-start justify-start bg-slate-200">
        <Button
          onClick={handlePrevious}
          className="absolute top-5 left-5 bg-transparent p-2.5"
          size="icon"
        >
          {currentStep <= 2 ? (
            <X className="size-10" />
          ) : (
            <ChevronLeft className="size-10" />
          )}
        </Button>

        <div className="mt-40 flex flex-col items-start justify-start gap-8">
          {steps.map((step, i) => (
            <button
              key={step}
              onClick={() => goToStep(i + 1)}
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
            </button>
          ))}
        </div>
      </aside>

      <main className="ml-[300px] flex w-full items-center justify-center pt-[140px] pb-20">
        {currentStep === 1 && (
          <CreateProjectForm
            banner={banner}
            setBanner={setBanner}
            nextStep={nextStep}
            setProjectInfos={setProjectInfos}
          />
        )}

        {currentStep === 2 && (
          <div className="flex h-full w-full flex-col items-center justify-center px-[140px]">
            <Editor
              nextStep={nextStep}
              projectInfos={projectInfos}
              setProjectInfos={setProjectInfos}
            />
          </div>
        )}

        {currentStep === 3 && projectInfos && (
          <div className="flex h-full w-full flex-col items-center justify-center px-[52px]">
            <ProjectCardPreview
              title={projectInfos.title}
              author={projectInfos.author}
              tags={[
                projectInfos.semester,
                projectInfos.subjectId,
                projectInfos.publishedYear,
              ]}
              description={projectInfos.description}
              professor={
                projectInfos.professorsIds &&
                projectInfos.professorsIds.length > 0
                  ? [projectInfos.professorsIds[0]]
                  : []
              }
              banner={banner}
            />

            <div className="mt-10 mr-[88px] flex w-full flex-row justify-end gap-2">
              <Button size="sm">Salvar Rascunho</Button>

              <Button onClick={nextStep} variant="dark" type="submit" size="sm">
                Avançar
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
