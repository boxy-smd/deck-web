import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'
import { useTagsDependencies } from '@/contexts/hooks/use-tags-dependencies'
import { createDraft, getDraftDetails, saveDraft } from '@/functions/drafts'
import { publishProject, uploadProjectBanner } from '@/functions/projects'

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

  const methods = useForm({
    resolver: zodResolver(publishProjectFormSchema),
  })

  const projectInfos = methods.watch() as CreateProjectFormSchema

  const bannerUrl = projectInfos.banner
    ? URL.createObjectURL(projectInfos.banner)
    : ''

  const [currentStep, setCurrentStep] = useState(1)

  async function handleGetDraftDetails() {
    if (!draftId) {
      return
    }

    const draftData = await getDraftDetails(draftId)

    methods.reset(draftData)

    return draftData
  }

  const { data: draftData } = useQuery({
    queryKey: ['draft', draftId],
    queryFn: handleGetDraftDetails,
    enabled: !!draftId,
  })

  function handlePreviousStep() {
    setCurrentStep(page => page - 1)
  }

  function handleNextStep() {
    setCurrentStep(page => page + 1)
  }

  function handleStep(step: number) {
    setCurrentStep(step)
  }

  const saveDraftMutation = useMutation({
    mutationFn: handleSaveDraft,
  })

  async function handleSaveDraft() {
    const project = methods.getValues() as CreateProjectFormSchema

    if (draftId) {
      await saveDraft(draftId, project)

      if (project.banner) {
        const formData = new FormData()
        formData.append('file', project.banner)
        uploadProjectBanner(formData, draftId)
      }

      return router.push('/')
    }

    const createdDraftId = await createDraft(project)

    if (project.banner) {
      const formData = new FormData()
      formData.append('file', project.banner)
      await uploadProjectBanner(formData, createdDraftId)
    }

    return router.push('/')
  }

  const publishProjectMutation = useMutation({
    mutationFn: handlePublishProject,
  })

  async function handlePublishProject() {
    const project = methods.getValues() as CreateProjectFormSchema

    const projectId = await publishProject(project, draftId)

    if (project.banner) {
      const formData = new FormData()
      formData.append('file', project.banner)
      await uploadProjectBanner(formData, projectId)
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
    saveDraftMutation,
    publishProjectMutation,
    draftData,
  }
}
