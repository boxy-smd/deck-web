'use client'

import { useState } from 'react'

import { CreateProjectForm } from '@/components/create-project-form'
import { Button } from '@/components/ui/button'
import { Editor } from '@/components/ui/editor'
import './stepper.css'
import { Check } from 'lucide-react'

export default function ProjectPageEdit() {
  const [currentStep, setCurrentStep] = useState<number>(1)

  const steps: string[] = ['Cadastrar', 'Documentar', 'Revisar']

  const handleStepChange = () => {
    setCurrentStep((prev: number) => prev + 1)
  }

  return (
    <div className="flex h-screen flex-row">
      <div>
        <div className="flex h-full min-w-[300px] flex-col items-start justify-start bg-slate-200 text-start">
          <div className="mt-44 flex h-full min-w-[300px] flex-col items-start justify-start gap-8 overflow-y-auto">
            {steps.map((step, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={i}
                className={`step-item mx-auto w-1/2 ${currentStep === i + 1 ? 'active' : ''}${i + 1 < currentStep ? 'complete' : ''}`}
              >
                <div className="step">
                  <span className="number">{i + 1}</span>
                  <span className="check">
                    {i + 1 < currentStep && <Check className="size-4" />}
                  </span>
                </div>
                <div>
                  <div className="text-slate-500 text-xs">PASSO {i + 1}</div>
                  <p className="font-medium text-slate-900">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Step Content */}
      <div className="flex h-full w-full flex-row overflow-hidden">
        <div className="mx-auto flex h-full w-full items-center justify-center">
          <div className="flex h-full flex-col items-center justify-center">
            {/* Step 1: Create Project Form */}
            {currentStep === 1 && (
              <div className="h-full w-full">
                <CreateProjectForm setCurrentStep={setCurrentStep} />
              </div>
            )}

            {/* Step 2+: Editor */}
            {currentStep === 2 && (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="min-h-[900px] w-[1100px] overflow-auto rounded-xl border-2 border-black/20 bg-slate-100 shadow-sm">
                  <Editor />
                </div>
                <div className="mt-5 flex w-full justify-end gap-2">
                  <Button
                    className="rounded-md bg-slate-200 px-2 py-2 text-slate-700"
                    type="button"
                  >
                    Salvar Rascunho
                  </Button>
                  <Button
                    className="rounded-md bg-slate-700 px-2 py-2 text-slate-100"
                    type="submit"
                    onClick={handleStepChange}
                  >
                    Avançar
                  </Button>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="h-4/5 min-w-[1200px] border-2">a</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
