'use client'

import { useState } from 'react'

import { CreateProjectForm } from '@/components/create-project-form'
import { Button } from '@/components/ui/button'
import { Editor } from '@/components/ui/editor'

export default function ProjectPageEdit() {
  const [shouldItGoNext, setShouldItGoNext] = useState<boolean>(false)

  return (
    <div className="flex flex-col items-center">
      <div>Editando Projeto</div>
      <div className={`${shouldItGoNext ? 'hidden' : 'block'}`}>
        <CreateProjectForm setShouldItGoNext={setShouldItGoNext} />
      </div>
      <div className={`${shouldItGoNext ? 'block' : 'hidden'}`}>
        <div
          className={
            'min-h-[940px] w-[1100px] overflow-hidden rounded-xl border-2 border-black/20 bg-slate-100 shadow-sm'
          }
        >
          <Editor />
        </div>
        <div className="mt-5 mb-6 flex w-full flex-row justify-end gap-2">
          <Button
            className="rounded-md bg-slate-200 px-2 py-2 text-slate-700"
            type="button"
          >
            Salvar Rascunho
          </Button>
          <Button
            className="rounded-md bg-slate-700 px-2 py-2 text-slate-100"
            type="submit"
          >
            Avançar
          </Button>
        </div>
      </div>
    </div>
  )
}
