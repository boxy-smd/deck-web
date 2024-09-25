import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'
import { useTagsDependencies } from '@/contexts/hooks/use-tags-dependencies'
import type { Draft } from '@/entities/project'
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

  const getDraftDetails = useCallback(async () => {
    const { data } = await instance.get<{
      draft: Draft
    }>(`/drafts/${draftId}`)

    methods.reset({
      bannerUrl: data.draft.bannerUrl,
      title: data.draft.title,
      trailsIds: data.draft.trailsIds,
      subjectId: data.draft.subjectId,
      semester: data.draft.semester,
      publishedYear: data.draft.publishedYear,
      description: data.draft.description,
      professorsIds: data.draft.professorsIds,
      allowComments: data.draft.allowComments,
      content: data.draft.content,
    })
  }, [draftId, methods.reset])

  useEffect(() => {
    if (draftId) {
      getDraftDetails()
    }
  }, [draftId, getDraftDetails])

  function handlePreviousStep() {
    setCurrentStep(page => page - 1)
  }

  function handleNextStep() {
    setCurrentStep(page => page + 1)
  }

  function handleStep(step: number) {
    setCurrentStep(step)
  }

  async function saveDraft() {
    const project = methods.getValues()

    if (draftId) {
      await instance.put(
        `/drafts/${draftId}`,
        {
          title: project.title,
          description: project.description,
          content: project.content,
          publishedYear: project.publishedYear,
          semester: project.semester,
          allowComments: project.allowComments,
          subjectId: project.subjectId,
          trailsIds: project.trailsIds,
          professorsIds: project.professorsIds,
        },
      )

      if (project.banner) {
        uploadBanner(project.banner, draftId)
      }

      return router.push('/')
    }

    const { data } = await instance.post(
      '/drafts',
      {
        title: project.title,
        description: project.description,
        content: project.content,
        publishedYear: project.publishedYear,
        semester: project.semester,
        allowComments: project.allowComments,
        subjectId: project.subjectId,
        trailsIds: project.trailsIds,
        professorsIds: project.professorsIds,
      }
    )

    if (project.banner) {
      uploadBanner(project.banner, data.draftId)
    }

    return router.push('/')
  }

  async function uploadBanner(file: File, projectId: string) {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await instance.postForm<{
      url: string
    }>(`/banners/${projectId}`, formData)

    return data.url
  }

  async function handlePublishProject() {
    const project = methods.getValues()

    const { data } = await instance.post('/projects', {
      title: project.title,
      description: project.description,
      content: project.content,
      publishedYear: project.publishedYear,
      status: 'PUBLISHED',
      semester: project.semester,
      allowComments: project.allowComments,
      subjectId: project.subjectId,
      trailsIds: project.trailsIds,
      professorsIds: project.professorsIds,
      draftId: draftId || undefined,
    })

    if (project.banner) {
      await uploadBanner(project.banner, data.project_id)
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
    saveDraft,
    handlePublishProject,
  }
}
