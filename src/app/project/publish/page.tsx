'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { ContentPreview } from '@/components/publish/content-preview'
import { PublishProjectFormSidebar } from '@/components/publish/sidebar'
import { DocumentProjectStep } from '@/components/publish/steps/document-project'
import { PreviewProjectStep } from '@/components/publish/steps/preview-project'
import { RegisterProjectStep } from '@/components/publish/steps/register-project'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Professor } from '@/entities/professor'
import type { Profile } from '@/entities/profile'
import type { Draft } from '@/entities/project'
import type { Subject } from '@/entities/subject'
import type { Trail } from '@/entities/trail'
import { instance } from '@/lib/axios'

const createProjectFormSchema = z.object({
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

export type CreateProjectFormSchema = z.infer<typeof createProjectFormSchema>

export default function PublishProject() {
  const draftId = useSearchParams().get('draftId')

  const router = useRouter()

  const { data: session } = useSession()

  const getUserDetails = useCallback(async () => {
    const { data } = await instance.get<{
      details: Profile
    }>('/students/me', {
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    })

    return data.details
  }, [session])

  const { data: student } = useQuery({
    queryKey: ['students', 'me'],
    queryFn: getUserDetails,
    enabled: Boolean(session),
  })

  const methods = useForm<CreateProjectFormSchema>({
    resolver: zodResolver(createProjectFormSchema),
  })

  const projectInfos = methods.watch()

  const bannerUrl = projectInfos.banner
    ? URL.createObjectURL(projectInfos.banner)
    : ''

  const [currentStep, setCurrentStep] = useState(1)

  const fetchTrails = useCallback(async () => {
    const { data } = await instance.get<{
      trails: Trail[]
    }>('/trails')

    return data.trails
  }, [])

  const fetchSubjects = useCallback(async () => {
    const { data } = await instance.get<{
      subjects: Subject[]
    }>('/subjects')

    return data.subjects as Subject[]
  }, [])

  const fetchProfessors = useCallback(async () => {
    const { data } = await instance.get<{
      professors: Professor[]
    }>('/professors')

    return data.professors
  }, [])

  const getDraftDetails = useCallback(async () => {
    const { data } = await instance.get<{
      draft: Draft
    }>(`/drafts/${draftId}`, {
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    })

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
  }, [draftId, methods.reset, session])

  useEffect(() => {
    if (draftId) {
      getDraftDetails()
    }
  }, [draftId, getDraftDetails])

  const { data: trails } = useQuery({
    queryKey: ['trails'],
    queryFn: fetchTrails,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
  })

  const { data: professors } = useQuery({
    queryKey: ['professors'],
    queryFn: fetchProfessors,
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
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
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
      },
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      },
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
    }>(`/banners/${projectId}`, formData, {
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    })

    return data.url
  }

  async function handlePublishProject() {
    const project = methods.getValues()

    const { data } = await instance.post(
      '/projects',
      {
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
      },
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      },
    )

    if (project.banner) {
      await uploadBanner(project.banner, data.project_id)
    }

    return router.push('/')
  }

  return (
    <div className="flex min-h-screen flex-row bg-slate-50">
      <PublishProjectFormSidebar
        currentStep={currentStep}
        onPreviousStep={handlePreviousStep}
        onStep={handleStep}
        onSaveDraft={saveDraft}
        hasProjectTitle={Boolean(projectInfos.title)}
      />

      <Tabs
        className="ml-[300px] flex w-full flex-col items-center justify-center pt-20"
        defaultValue="edit"
      >
        <TabsList className="mb-3">
          <TabsTrigger value="edit">
            {currentStep < 3 ? 'Editar' : 'Publicação'}
          </TabsTrigger>

          <TabsTrigger value="preview">
            {currentStep < 3 ? 'Visualizar' : 'Projeto'}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="edit"
          className="flex w-full items-center justify-center"
        >
          <FormProvider {...methods}>
            <form className="flex w-full items-center justify-center pb-20">
              {currentStep === 1 && (
                <RegisterProjectStep
                  onSaveDraft={saveDraft}
                  onNextStep={handleNextStep}
                  trails={trails}
                  subjects={subjects}
                  professors={professors}
                />
              )}

              {currentStep === 2 && (
                <DocumentProjectStep
                  onNextStep={handleNextStep}
                  onSaveDraft={saveDraft}
                />
              )}

              {currentStep === 3 && (
                <PreviewProjectStep
                  onPublish={handlePublishProject}
                  onSaveDraft={saveDraft}
                  title={projectInfos.title}
                  author={student?.name || ''}
                  bannerUrl={bannerUrl}
                  professors={
                    professors
                      ?.filter(professor =>
                        projectInfos.professorsIds?.includes(professor.id),
                      )
                      .map(professor => professor.name) || []
                  }
                  publishedYear={projectInfos.publishedYear}
                  semester={projectInfos.semester}
                  subject={
                    subjects?.find(
                      subject => subject.id === projectInfos.subjectId,
                    )?.name || undefined
                  }
                  description={projectInfos.description}
                />
              )}
            </form>
          </FormProvider>
        </TabsContent>

        <TabsContent
          value="preview"
          className="flex h-full w-full items-center justify-center"
        >
          <ContentPreview
            title={projectInfos.title}
            bannerUrl={bannerUrl}
            professors={
              professors
                ?.filter(professor =>
                  projectInfos.professorsIds?.includes(professor.id),
                )
                .map(professor => professor.name) || []
            }
            trails={
              trails
                ?.filter(trail => projectInfos.trailsIds?.includes(trail.id))
                .map(trail => trail.name) || []
            }
            publishedYear={projectInfos.publishedYear}
            semester={projectInfos.semester}
            subject={
              subjects?.find(subject => subject.id === projectInfos.subjectId)
                ?.name || undefined
            }
            description={projectInfos.description}
            content={projectInfos.content}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
