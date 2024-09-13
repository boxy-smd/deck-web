'use client'

import { Check } from 'lucide-react'
import { useState } from 'react'

import { CreateProjectForm } from '@/components/create-project-form'
import { ProjectCardPreview } from '@/components/project-card-preview'
import { Button } from '@/components/ui/button'
import { Editor } from '@/components/ui/editor'
import { cn } from '@/lib/utils'

export type ProjectInfo = {
  title: string
  author: string
  tags: string[]
  year: string
  semester: string
  course: string
  description: string
  professors: string
}

export default function ProjectPageEdit() {
  const [projectInfos, setProjectInfos] = useState<ProjectInfo | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const steps = ['Cadastrar', 'Documentar', 'Revisar']

  function nextStep() {
    setCurrentStep(prev => prev + 1)
    console.log(currentStep)
  }

  return (
    <div className="flex min-h-screen flex-row bg-slate-50">
      <aside className="fixed top-0 left-0 z-10 flex h-full w-fit min-w-[300px] flex-col items-start justify-start bg-slate-200">
        <div className="mt-40 flex flex-col items-start justify-start gap-8">
          {steps.map((step, i) => (
            <button
              key={step}
              className="relative flex w-full flex-row items-center justify-start gap-5 px-16"
              type="button"
            >
              <div
                className={cn(
                  'relative z-10 flex size-10 items-center justify-center rounded-full border-2 border-slate-400 bg-slate-200 font-semibold text-slate-400',
                  i + 1 <= currentStep &&
                    'border-slate-700 bg-slate-700 text-slate-50',
                )}
              >
                {i + 1 < currentStep ? (
                  <Check className="size-4" />
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
            nextStep={nextStep}
            setProjectInfos={setProjectInfos}
          />
        )}

        {currentStep === 2 && (
          <div className="flex h-full w-full flex-col items-center justify-center px-[140px]">
            <Editor />

            <div className="mt-5 flex w-full flex-row justify-end gap-2">
              <Button size="sm">Salvar Rascunho</Button>

              <Button variant="dark" type="submit" size="sm">
                Avançar
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && projectInfos && (
          <ProjectCardPreview
            title={projectInfos.title}
            author={projectInfos.author}
            tags={[
              projectInfos.semester,
              projectInfos.course,
              projectInfos.year,
            ]}
            description={projectInfos.description}
            professor={projectInfos.professors}
          />
        )}
      </main>
    </div>
  )
}
