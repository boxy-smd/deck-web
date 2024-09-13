'use client'

import { Check } from 'lucide-react'
import { useState } from 'react'

import { CreateProjectForm } from '@/components/create-project-form'
import { Button } from '@/components/ui/button'
import { Editor } from '@/components/ui/editor'

import './stepper.css'
import { ProjectCardPreview } from '@/components/project-card-preview'
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
    <div className="flex h-screen flex-row">
      <div>
        <div className="flex h-full min-w-[300px] flex-col items-start justify-start bg-slate-200 text-start">
          <div className="mt-40 flex h-full flex-col items-start justify-start gap-8 overflow-y-auto">
            {steps.map((step, i) => (
              <button
                key={step}
                className={cn(
                  'step-item w-full px-16',
                  i + 1 === currentStep && 'active',
                  i + 1 < currentStep && 'completed',
                )}
                type="button"
              >
                <div className="step">
                  {
                    i + 1 < currentStep ? (
                      <Check className="size-4" />
                    ) : (
                      <span className="number">{i + 1}</span>
                    )
                  }

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
        </div>
      </div>

      <div className='flex h-full w-full flex-row overflow-hidden'>
        <div className="mx-auto flex h-full w-full items-center justify-center">
          <div className="flex h-full flex-col items-center justify-center">
            {currentStep === 1 && (
              <div className='flex h-full w-full items-center justify-center'>
                <CreateProjectForm nextStep={nextStep} setProjectInfos={setProjectInfos} />
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="min-h-[900px] w-[1100px] overflow-auto rounded-xl border-2 border-black/20 bg-slate-100 shadow-sm">
                  <Editor />
                </div>

                <div className="mt-5 flex w-full justify-end gap-2">
                  <Button>Salvar Rascunho</Button>
                  <Button onClick={nextStep}>Avançar</Button>
                </div>
              </div>
            )}

            {currentStep === 3 && projectInfos && (

              <ProjectCardPreview
                title={projectInfos.title}
                author={projectInfos.author}
                tags={[projectInfos.semester, projectInfos.course, projectInfos.year]}
                description={projectInfos.description}
                professor={projectInfos.professors} />

            )}
          </div>
        </div>
      </div>
    </div>
  )
}
