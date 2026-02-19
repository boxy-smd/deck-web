'use client'

import { ChevronLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { ProjectView } from '@/components/project-view'

export default function ProjectPage() {
  const { projectId } = useParams<{
    projectId: string
  }>()
  const router = useRouter()

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[860px] px-3 pt-2 lg:px-0 lg:pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-deck-border bg-deck-bg px-3 font-medium text-[13px] text-deck-darkest hover:bg-slate-200"
        >
          <ChevronLeft size={18} />
          Voltar
        </button>
      </div>

      <ProjectView id={projectId} />
    </div>
  )
}
