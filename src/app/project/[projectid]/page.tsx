'use client'

import ProjectView from '@/components/project-view'
import { ChevronLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

export default function ProjectPage() {
  const { projectId } = useParams<{
    projectId: string
  }>()
  const router = useRouter()

  return (
    <div>
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-200"
      >
        <ChevronLeft size={24} />
      </button>

      <ProjectView id={projectId} />
    </div>
  )
}
