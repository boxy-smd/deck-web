import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'
import { useTagsDependencies } from '@/contexts/hooks/use-tags-dependencies'
import { getDraftDetails, saveDraft } from '@/functions/drafts'
import { publishProject, uploadProjectBanner } from '@/functions/projects'
import { instance } from '@/lib/axios'

const publishProjectFormSchema = z.object({
  banner: z.instanceof(File).optional(),
  bannerUrl: z.string().optional(),
  title: z.string().min(1).max(29),
  trailsIds: z.array(z.string().uuid()),
  subjectId: z.string().uuid().optional(),
  semester: z.coerce.number(),
  publishedYear: z.coerce.number(),
  description: z.string().min(1),
  professorsIds: z.array(z.string().uuid()).optional(),
  allowComments: z.boolean().default(false),
  content: z.string(),
})

export type CreateProjectFormSchema = z.infer<typeof publishProjectFormSchema>

export function usePublishProject() {
  const draftId = useSearchParams().get('draftId')
  const router = useRouter()

  const { trails, professors, subjects } = useTagsDependencies()
  const { student } = useAuthenticatedStudent()

  const methods = useForm<CreateProjectFormSchema>({
    resolver: zodResolver(publishProjectFormSchema),
  })

  const projectInfos = methods.watch()

  const bannerUrl = projectInfos.banner
    ? URL.createObjectURL(projectInfos.banner)
    : ''

  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (draftId) {
      getDraftDetails(draftId).then(draft => {
        methods.reset({
          bannerUrl: draft.bannerUrl,
          title: draft.title,
          trailsIds: draft.trailsIds,
          subjectId: draft.subjectId,
          semester: draft.semester,
          publishedYear: draft.publishedYear,
          description: draft.description,
          professorsIds: draft.professorsIds,
          allowComments: draft.allowComments,
          content: draft.content,
        })
      })
    }
  }, [draftId, methods])

  function handlePreviousStep() {
    setCurrentStep(page => page - 1)
  }

  function handleNextStep() {
    setCurrentStep(page => page + 1)
  }

  function handleStep(step: number) {
    setCurrentStep(step)
  }

  async function handleSaveDraft() {
    const project = methods.getValues()

    if (draftId) {
      await saveDraft(draftId, project)

      if (project.banner) {
        uploadProjectBanner(project.banner, draftId)
      }

      return router.push('/')
    }

    const { data } = await instance.post('/drafts', {
      title: project.title,
      description: project.description,
      content: project.content,
      publishedYear: project.publishedYear,
      semester: project.semester,
      allowComments: project.allowComments,
      subjectId: project.subjectId,
      trailsIds: project.trailsIds,
      professorsIds: project.professorsIds,
    })

    if (project.banner) {
      await uploadProjectBanner(project.banner, data.draftId)
    }

    return router.push('/')
  }

  async function handlePublishProject() {
    const project = methods.getValues()

    const projectId = await publishProject(project, draftId)

    if (project.banner) {
      await uploadProjectBanner(project.banner, projectId)
    }

    return router.push('/')
  }

  return {
    methods,
    projectInfos,
    bannerUrl,
    student,
    trails,
    professors,
    subjects,
    currentStep,
    handlePreviousStep,
    handleNextStep,
    handleStep,
    handleSaveDraft,
    handlePublishProject,
  }
}
