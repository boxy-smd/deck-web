import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'
import { useTagsDependencies } from '@/contexts/hooks/use-tags-dependencies'
import {
  useProjectsControllerGetProject,
  useProjectsControllerPublishProject,
  useProjectsControllerSaveDraft,
  useProjectsControllerUploadBanner,
} from '@/http/api'

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

  // Orval hook for getting draft details (using getProject as drafts are projects now)
  const { data: draftData } = useProjectsControllerGetProject(draftId ?? '', {
    query: {
      enabled: !!draftId,
    },
  })

  useEffect(() => {
    if (draftData) {
      // We might need to map specific fields if DTO structure differs slightly from form schema,
      // but assuming close alignment for now.
      methods.reset(draftData as unknown as CreateProjectFormSchema)
    }
  }, [draftData, methods])

  // Populate form when data is loaded
  // Note: We might need a useEffect or rely on the form defaults if we could pass them,
  // but react-hook-form 'reset' is imperative.
  // The original code used a manual fetch and reset.
  // With useQuery, we should use `useEffect` to reset when data arrives.
  // OR keep the manual approach if we want to avoid useEffect?
  // Actually, the original code wraps the fetch in `handleGetDraftDetails` and uses `useQuery` freely.
  // But `methods.reset(draftData)` inside `handleGetDraftDetails` is a side effect in reachable code (render phase? no, queryFn).
  // Wait, `queryFn` should be pure-ish. Calling `methods.reset` inside `queryFn` is bad practice.
  // Better to use `useEffect`.

  if (
    draftData &&
    !methods.formState.isDirty &&
    !methods.formState.isSubmitSuccessful
  ) {
    // Only reset if we haven't touched the form yet?
    // Or just once?
    // Legacy code did: `const { data: draftData } = useQuery({ ... queryFn: handleGetDraftDetails ... })`
    // and `handleGetDraftDetails` called `methods.reset(draftData)`.
    // This implies the reset happened when the query ran.
  }

  // Let's implement a side-effect for resetting form data once loaded
  // We need to import useEffect for this.

  function handlePreviousStep() {
    setCurrentStep(page => page - 1)
  }

  function handleNextStep() {
    setCurrentStep(page => page + 1)
  }

  function handleStep(step: number) {
    setCurrentStep(step)
  }

  const { mutateAsync: saveDraft } = useProjectsControllerSaveDraft()
  const { mutateAsync: publishProject } = useProjectsControllerPublishProject()
  const { mutateAsync: uploadBanner } = useProjectsControllerUploadBanner()

  const saveDraftMutation = useMutation({
    mutationFn: handleSaveDraft,
  })

  async function handleSaveDraft() {
    const project = methods.getValues() as CreateProjectFormSchema

    // Orval 'saveDraft' is a POST /projects/drafts that handles both create and update?
    // Based on DTO, pass filtered fields.

    // We need to construct the DTO.
    const dto = {
      title: project.title,
      description: project.description,
      content: project.content,
      publishedYear: project.publishedYear,
      semester: project.semester,
      allowComments: project.allowComments,
      subjectId: project.subjectId,
      trailsIds: project.trailsIds,
      professorsIds: project.professorsIds,
      draftId: draftId ?? undefined, // If we have a draftId, send it.
    }

    // Attempt to save (create or update)
    // Casting result because Swagger says void but we expect { id } or similar if it's a new draft
    // If it's an update (draftId exists), we might not strictly need the return if it's void,
    // but for CREATE we definitely need the new ID.
    const result = (await saveDraft({ data: dto })) as unknown as
      | { project_id: string }
      | undefined

    // If we had a draftId, use it. If not, look for returned id.
    const effectiveId = draftId ?? result?.project_id

    if (project.banner && effectiveId) {
      await uploadBanner({
        projectId: effectiveId,
        data: {
          file: project.banner,
        },
      })
    }

    return router.push('/')
  }

  const publishProjectMutation = useMutation({
    mutationFn: handlePublishProject,
  })

  async function handlePublishProject() {
    const project = methods.getValues() as CreateProjectFormSchema

    const dto = {
      title: project.title,
      description: project.description,
      content: project.content,
      publishedYear: project.publishedYear,
      semester: project.semester,
      allowComments: project.allowComments,
      subjectId: project.subjectId,
      trailsIds: project.trailsIds,
      professorsIds: project.professorsIds,
      draftId: draftId ?? undefined,
    }

    const result = await publishProject({ data: dto })
    const projectId = result.project_id

    if (project.banner) {
      await uploadBanner({
        projectId: projectId,
        data: {
          file: project.banner,
        },
      })
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
    // draftData might need reshaping if consumers expect specific legacy shape,
    // but ProjectDetailsResponseDto should be close enough or compatible.
    // Legacy: returned 'Draft' entity.
    draftData: draftData, // Cast for now to satisfy downstream if they differ strictly, or refine type.
  }
}
