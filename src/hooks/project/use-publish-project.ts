import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'
import { useTagsDependencies } from '@/contexts/hooks/use-tags-dependencies'
import {
  getProjectsControllerFetchPostsQueryKey,
  useProjectsControllerGetProject,
  useProjectsControllerPublishProject,
  useProjectsControllerSaveDraft,
  useProjectsControllerUploadBanner,
} from '@/http/api'
import { queryClient } from '@/lib/tanstack-query/client'

const publishProjectFormSchema = z.object({
  banner: z.instanceof(File).optional(),
  bannerUrl: z.string().optional(),
  title: z
    .string()
    .trim()
    .min(1, 'Título é obrigatório.')
    .max(29, 'Título deve ter no máximo 29 caracteres.'),
  trailsIds: z
    .array(z.string().uuid())
    .min(1, 'Selecione pelo menos uma trilha.'),
  subjectId: z.string().uuid().optional(),
  semester: z.coerce
    .number()
    .min(1, 'Semestre deve ser entre 1 e 12.')
    .max(12, 'Semestre deve ser entre 1 e 12.'),
  publishedYear: z.coerce
    .number()
    .min(2014, 'Ano inválido.')
    .max(new Date().getFullYear() + 1, 'Ano inválido.'),
  description: z
    .string()
    .trim()
    .min(1, 'Descrição é obrigatória.')
    .max(300, 'Descrição deve ter no máximo 300 caracteres.'),
  professorsIds: z.array(z.string().uuid()).optional(),
  allowComments: z.boolean().default(false),
  content: z.string(),
})

export type CreateProjectFormSchema = z.infer<typeof publishProjectFormSchema>
export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error'

function getRequestErrorMessage(error: unknown, fallback: string) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return 'Sem conexão. Verifique sua internet e tente novamente.'
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as { message?: string }).message || '')
    if (message.trim()) {
      return message
    }
  }

  return fallback
}

export function usePublishProject() {
  const draftId = useSearchParams().get('draftId')
  const router = useRouter()

  const { trails, professors, subjects } = useTagsDependencies()
  const { student } = useAuthenticatedStudent()

  const methods = useForm({
    resolver: zodResolver(publishProjectFormSchema),
  })

  const projectInfos = methods.watch() as CreateProjectFormSchema
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('idle')
  const [autosaveLastSavedAt, setAutosaveLastSavedAt] = useState<Date | null>(
    null,
  )
  const [requestError, setRequestError] = useState<string | null>(null)
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftId)
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inFlightDraftSaveRef = useRef<{
    promise: Promise<string | null>
    signature: string
  } | null>(null)
  const autosaveRetryAttemptRef = useRef(0)
  const lastSavedSignatureRef = useRef<string>('')
  const isHydratingRef = useRef(false)

  const [bannerUrl, setBannerUrl] = useState('')

  useEffect(() => {
    if (projectInfos.banner) {
      const objectUrl = URL.createObjectURL(projectInfos.banner)
      setBannerUrl(objectUrl)

      return () => {
        URL.revokeObjectURL(objectUrl)
      }
    }

    setBannerUrl(projectInfos.bannerUrl || '')
  }, [projectInfos.banner, projectInfos.bannerUrl])

  const [currentStep, setCurrentStep] = useState(1)
  const [maxReachedStep, setMaxReachedStep] = useState(1)

  const { data: draftData } = useProjectsControllerGetProject(draftId ?? '', {
    query: {
      enabled: !!draftId,
      networkMode: 'online',
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  })

  async function flushPendingAutosave() {
    if (isHydratingRef.current) {
      return
    }

    if (!projectInfos.title?.trim()) {
      return
    }

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current)
    }

    if (autosaveSignature === lastSavedSignatureRef.current) {
      return
    }

    try {
      setAutosaveStatus('saving')
      const nextDraftId = await persistDraft(autosaveDto)
      lastSavedSignatureRef.current = JSON.stringify({
        ...autosaveDto,
        draftId: nextDraftId ?? undefined,
      })
      autosaveRetryAttemptRef.current = 0
      setAutosaveLastSavedAt(new Date())
      setAutosaveStatus('saved')
    } catch {
      setAutosaveStatus('error')
    }
  }

  useEffect(() => {
    if (draftData) {
      methods.reset(draftData as unknown as CreateProjectFormSchema)
    }
  }, [draftData, methods])

  useEffect(() => {
    setMaxReachedStep(previous => Math.max(previous, currentStep))
  }, [currentStep])

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: explicit validation for step gating
  const canAccessStep2 = useMemo(() => {
    const title = projectInfos.title?.trim() || ''
    const description = projectInfos.description?.trim() || ''
    const trailsCount = projectInfos.trailsIds?.length || 0
    const semester = Number(projectInfos.semester)
    const publishedYear = Number(projectInfos.publishedYear)
    const currentYear = new Date().getFullYear()

    if (!title || title.length > 29) {
      return false
    }

    if (!description || description.length > 300) {
      return false
    }

    if (trailsCount < 1) {
      return false
    }

    if (!Number.isFinite(semester) || semester < 1 || semester > 12) {
      return false
    }

    if (
      !Number.isFinite(publishedYear) ||
      publishedYear < 2014 ||
      publishedYear > currentYear + 1
    ) {
      return false
    }

    return true
  }, [
    projectInfos.description,
    projectInfos.publishedYear,
    projectInfos.semester,
    projectInfos.title,
    projectInfos.trailsIds,
  ])

  const maxAccessibleStep = useMemo(() => {
    let nextAccessibleStep = 1

    if (currentStep >= 2 || canAccessStep2 || maxReachedStep >= 2) {
      nextAccessibleStep = 2
    }

    if (currentStep >= 3 || currentStep >= 2 || maxReachedStep >= 3) {
      nextAccessibleStep = 3
    }

    return nextAccessibleStep
  }, [canAccessStep2, currentStep, maxReachedStep])

  async function changeStep(targetStep: number) {
    if (currentStep === 2 && targetStep !== 2) {
      await flushPendingAutosave()
    }

    setCurrentStep(targetStep)
  }

  async function handlePreviousStep() {
    await changeStep(currentStep - 1)
  }

  async function handleNextStep() {
    const targetStep = Math.min(3, currentStep + 1)

    if (targetStep > maxAccessibleStep) {
      return
    }

    await changeStep(targetStep)
  }

  async function handleStep(step: number) {
    if (step > maxAccessibleStep) {
      return
    }

    await changeStep(step)
  }

  const { mutateAsync: saveDraft } = useProjectsControllerSaveDraft({
    mutation: {
      networkMode: 'online',
      retry: 1,
    },
  })
  const { mutateAsync: publishProject } = useProjectsControllerPublishProject({
    mutation: {
      networkMode: 'online',
      retry: 0,
    },
  })
  const { mutateAsync: uploadBanner } = useProjectsControllerUploadBanner({
    mutation: {
      networkMode: 'online',
      retry: 0,
    },
  })

  const autosaveDto = useMemo(
    () => ({
      title: projectInfos.title,
      description: projectInfos.description,
      content: projectInfos.content,
      publishedYear: projectInfos.publishedYear,
      semester: projectInfos.semester,
      allowComments: projectInfos.allowComments,
      subjectId: projectInfos.subjectId,
      trailsIds: projectInfos.trailsIds,
      professorsIds: projectInfos.professorsIds,
      draftId: currentDraftId ?? undefined,
    }),
    [
      currentDraftId,
      projectInfos.allowComments,
      projectInfos.content,
      projectInfos.description,
      projectInfos.publishedYear,
      projectInfos.professorsIds,
      projectInfos.semester,
      projectInfos.subjectId,
      projectInfos.title,
      projectInfos.trailsIds,
    ],
  )

  const autosaveSignature = JSON.stringify(autosaveDto)

  const saveDraftMutation = useMutation({
    mutationFn: handleSaveDraft,
    networkMode: 'online',
    retry: 0,
    onMutate: () => {
      setRequestError(null)
    },
    onError: error => {
      setRequestError(
        getRequestErrorMessage(
          error,
          'Não foi possível salvar o rascunho. Tente novamente.',
        ),
      )
    },
    onSuccess: () => {
      setRequestError(null)
    },
  })

  const persistDraft = useCallback(
    async (data: typeof autosaveDto) => {
      const signature = JSON.stringify(data)

      if (inFlightDraftSaveRef.current) {
        if (inFlightDraftSaveRef.current.signature === signature) {
          return inFlightDraftSaveRef.current.promise
        }

        await inFlightDraftSaveRef.current.promise
      }

      const savePromise = (async () => {
        const result = (await saveDraft({
          data,
        })) as unknown as { project_id: string } | undefined

        const nextDraftId = currentDraftId ?? result?.project_id ?? null

        if (!currentDraftId && nextDraftId) {
          setCurrentDraftId(nextDraftId)
          router.replace(`/projects/publish?draftId=${nextDraftId}`)
        }

        return nextDraftId
      })()

      inFlightDraftSaveRef.current = {
        promise: savePromise,
        signature,
      }

      try {
        return await savePromise
      } finally {
        inFlightDraftSaveRef.current = null
      }
    },
    [currentDraftId, router, saveDraft],
  )

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
      draftId: currentDraftId ?? undefined,
    }

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current)
    }

    const effectiveId = await persistDraft(dto)

    if (project.banner && effectiveId) {
      await uploadBanner({
        projectId: effectiveId,
        data: {
          file: project.banner,
        },
      })
    }

    await queryClient.invalidateQueries({
      queryKey: getProjectsControllerFetchPostsQueryKey(),
    })
    await queryClient.invalidateQueries({
      queryKey: ['/posts/search'],
    })

    return router.push('/')
  }

  const publishProjectMutation = useMutation({
    mutationFn: handlePublishProject,
    networkMode: 'online',
    retry: 0,
    onMutate: () => {
      setRequestError(null)
    },
    onError: error => {
      setRequestError(
        getRequestErrorMessage(
          error,
          'Não foi possível publicar o projeto. Tente novamente.',
        ),
      )
    },
    onSuccess: () => {
      setRequestError(null)
    },
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
      draftId: currentDraftId ?? undefined,
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

    await queryClient.invalidateQueries({
      queryKey: getProjectsControllerFetchPostsQueryKey(),
    })
    await queryClient.invalidateQueries({
      queryKey: ['/posts/search'],
    })

    return router.push('/')
  }

  useEffect(() => {
    if (!draftData) {
      return
    }

    isHydratingRef.current = true
    lastSavedSignatureRef.current = JSON.stringify({
      title: draftData.title,
      description: draftData.description,
      content: draftData.content,
      publishedYear: draftData.publishedYear,
      semester: draftData.semester,
      allowComments: draftData.allowComments,
      subjectId: draftData.subjectId,
      trailsIds: draftData.trailsIds,
      professorsIds: draftData.professorsIds,
      draftId: draftData.id,
    })
    setCurrentDraftId(draftData.id)
    setAutosaveStatus('saved')
    setAutosaveLastSavedAt(
      draftData.updatedAt ? new Date(draftData.updatedAt) : new Date(),
    )

    const timeout = setTimeout(() => {
      isHydratingRef.current = false
    }, 0)

    return () => clearTimeout(timeout)
  }, [draftData])

  useEffect(() => {
    if (currentStep === 3) {
      return
    }

    if (isHydratingRef.current) {
      return
    }

    if (!projectInfos.title?.trim()) {
      setAutosaveStatus('idle')
      return
    }

    if (autosaveSignature === lastSavedSignatureRef.current) {
      if (autosaveStatus === 'saving') {
        setAutosaveStatus('saved')
      }
      return
    }

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current)
    }

    const runAutosave = async (attempt: number) => {
      try {
        setAutosaveStatus('saving')
        const nextDraftId = await persistDraft(autosaveDto)

        lastSavedSignatureRef.current = JSON.stringify({
          ...autosaveDto,
          draftId: nextDraftId ?? undefined,
        })
        autosaveRetryAttemptRef.current = 0
        setAutosaveLastSavedAt(new Date())
        setAutosaveStatus('saved')
      } catch {
        if (attempt >= 3) {
          setAutosaveStatus('error')
          return
        }

        autosaveRetryAttemptRef.current = attempt
        const retryDelay = 1000 * 2 ** (attempt - 1)

        if (autosaveTimeoutRef.current) {
          clearTimeout(autosaveTimeoutRef.current)
        }

        autosaveTimeoutRef.current = setTimeout(() => {
          runAutosave(attempt + 1).catch(() => undefined)
        }, retryDelay)
      }
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      runAutosave(1).catch(() => undefined)
    }, 1200)

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current)
      }
    }
  }, [
    autosaveDto,
    autosaveSignature,
    autosaveStatus,
    currentStep,
    persistDraft,
    projectInfos.title,
  ])

  useEffect(() => {
    if (currentStep === 2) {
      return
    }

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current)
    }
  }, [currentStep])

  async function retryAutosaveNow() {
    if (!projectInfos.title?.trim()) {
      return
    }

    await flushPendingAutosave()
  }

  useEffect(() => {
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current)
      }
    }
  }, [])

  return {
    methods,
    projectInfos,
    bannerUrl,
    student,
    trails,
    professors,
    subjects,
    currentStep,
    maxAccessibleStep,
    canAdvanceToNextStep: Math.min(3, currentStep + 1) <= maxAccessibleStep,
    handlePreviousStep,
    handleNextStep,
    handleStep,
    saveDraftMutation,
    publishProjectMutation,
    autosaveStatus,
    autosaveLastSavedAt,
    retryAutosaveNow,
    draftData,
    requestError,
    clearRequestError: () => setRequestError(null),
  }
}
