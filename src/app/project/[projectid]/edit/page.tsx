'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronLeft, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { CreateProjectForm } from '@/components/create-project-form'
import { ProjectCardPreview } from '@/components/project-card-preview'
import { ContentPreview } from '@/components/publish/content-preview'
import { Button } from '@/components/ui/button'
import { Editor } from '@/components/ui/editor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLoggedStudent } from '@/contexts/hooks/use-logged-student'
import type { Professor } from '@/entities/professor'
import type { Subject } from '@/entities/subject'
import type { Trail } from '@/entities/trail'
import { instance } from '@/lib/axios'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'

export type ProjectInfo = {
  title: string
  description: string
  bannerUrl: string
  content: string
  publishedYear: string
  status: string
  semester: string
  author: string
  subjectId: string
  trailsIds: string[]
  professorsIds: string[]
}

const createProjectFormSchema = z.object({
  banner: z.instanceof(File).optional(),
  title: z.string().min(1).max(29),
  trailsIds: z.array(z.string().uuid()),
  subjectId: z.string().uuid().optional(),
  semester: z.coerce.number(),
  publishedYear: z.coerce.number(),
  description: z.string().min(1),
  professorsIds: z.array(z.string().uuid()).optional(),
  content: z.string(),
})

export type CreateProjectFormSchema = z.infer<typeof createProjectFormSchema>

export default function ProjectPageEdit() {
  const { student, token } = useLoggedStudent()
  const { projectId } = useParams<{
    projectId: string
  }>()

  const methods = useForm<CreateProjectFormSchema>({
    resolver: zodResolver(createProjectFormSchema),
  })

  const projectInfos = methods.watch()

  const bannerUrl = projectInfos.banner
    ? URL.createObjectURL(projectInfos.banner)
    : ''

  const [currentStep, setCurrentStep] = useState(1)

  const steps = ['Cadastrar', 'Documentar', 'Revisar']

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

  async function uploadBanner(file: File, projectId: string) {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await instance.postForm<{
      url: string
    }>(
      `/banners/${projectId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return data.url
  }

  async function handlePublishProject(project: CreateProjectFormSchema) {
    let bannerUrl = ''

    if (project.banner) {
      try {
        bannerUrl = await uploadBanner(project.banner, projectId)
      } catch (error) {
        console.error(error)
      }
    }

    try {
      const { data } = await instance.post(
        '/projects',
        {
          title: project.title,
          description: project.description,
          bannerUrl: project.banner ? bannerUrl : undefined,
          content: project.content,
          publishedYear: project.publishedYear,
          status: 'PUBLISHED',
          semester: 1,
          allowComments: true,
          subjectId: project.subjectId,
          trailsIds: project.trailsIds,
          professorsIds: project.professorsIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex min-h-screen flex-row bg-slate-50">
      <aside className="fixed top-0 left-0 z-10 flex h-full w-fit min-w-[300px] flex-col items-start justify-start bg-slate-200">
        <Button
          onClick={handlePreviousStep}
          className="absolute top-5 left-5 size-10 bg-transparent"
          size="icon"
        >
          {currentStep <= 2 ? (
            <X className="size-7" />
          ) : (
            <ChevronLeft className="size-7" />
          )}
        </Button>

        <div className="mt-40 flex flex-col items-start justify-start gap-8">
          {steps.map((step, i) => (
            <button
              key={step}
              onClick={() => handleStep(i + 1)}
              disabled={i + 1 > currentStep}
              className="relative flex w-full flex-row items-center justify-start gap-5 px-16"
              type="button"
            >
              <div
                className={cn(
                  'relative z-10 flex size-10 items-center justify-center rounded-full border-2 border-slate-400 bg-slate-200 font-semibold text-slate-400',
                  i + 1 < currentStep &&
                    'border-slate-600 bg-slate-600 text-slate-50',
                  i + 1 === currentStep &&
                    'border-slate-700 bg-slate-700 text-slate-50',
                )}
              >
                {i + 1 < currentStep ? (
                  <Check className="size-[18px]" />
                ) : (
                  <span className="number">{i + 1}</span>
                )}
              </div>

              <div className="text-left">
                <div className="text-slate-500 text-xs uppercase">
                  Passo {i + 1}
                </div>

                <p className="font-medium text-slate-900">{step}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

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

        <TabsContent asChild value="edit">
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(handlePublishProject)}
              className="flex w-full items-center justify-center pb-20"
            >
              {currentStep === 1 && (
                <CreateProjectForm
                  onNextStep={handleNextStep}
                  trails={trails}
                  subjects={subjects}
                  professors={professors}
                />
              )}

              {currentStep === 2 && (
                <div className="flex h-full w-full flex-col items-center justify-center px-[140px]">
                  <Editor onNextStep={handleNextStep} />
                </div>
              )}

              {currentStep === 3 && (
                <div className="flex h-full w-full flex-col items-center justify-center px-[52px]">
                  <ProjectCardPreview
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

                  <div className="mt-10 mr-[88px] flex w-full flex-row justify-end gap-2">
                    <Button size="sm">Salvar Rascunho</Button>
                    <Button variant="dark" type="submit" size="sm">
                      Avançar
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </FormProvider>
        </TabsContent>

        <TabsContent asChild value="preview">
          <div className="flex h-full w-full items-center justify-center">
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
