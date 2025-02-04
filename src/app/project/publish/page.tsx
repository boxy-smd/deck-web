'use client'

import { FormProvider } from 'react-hook-form'

import { ContentPreview } from '@/components/publish/content-preview'
import { PublishProjectFormSidebar } from '@/components/publish/sidebar'
import { DocumentProjectStep } from '@/components/publish/steps/document-project'
import { PreviewProjectStep } from '@/components/publish/steps/preview-project'
import { RegisterProjectStep } from '@/components/publish/steps/register-project'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePublishProject } from '@/hooks/project/use-publish-project'

export default function PublishProject() {
  const {
    bannerUrl,
    currentStep,
    handleNextStep,
    handlePreviousStep,
    saveDraftMutation,
    handleStep,
    methods,
    professors,
    projectInfos,
    publishProjectMutation,
    student,
    subjects,
    trails,
    draftData,
  } = usePublishProject()

  return (
    <div className="flex min-h-screen flex-row bg-deck-bg">
      <PublishProjectFormSidebar
        currentStep={currentStep}
        onPreviousStep={handlePreviousStep}
        onStep={handleStep}
        onSaveDraft={saveDraftMutation.mutate}
        hasProjectTitle={Boolean(projectInfos.title)}
      />

      <Tabs
        className="ml-[300px] flex w-full flex-col items-center justify-center bg-deck-bg pt-20"
        defaultValue="edit"
      >
        <TabsList className="mb-3 bg-deck-bg-button text-deck-darkest">
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
                  onSaveDraft={saveDraftMutation.mutate}
                  onNextStep={handleNextStep}
                  trails={trails.data}
                  subjects={subjects.data}
                  professors={professors.data}
                  draftData={draftData}
                />
              )}

              {currentStep === 2 && (
                <DocumentProjectStep
                  onNextStep={handleNextStep}
                  onSaveDraft={saveDraftMutation.mutate}
                />
              )}

              {currentStep === 3 && (
                <PreviewProjectStep
                  onPublish={publishProjectMutation.mutate}
                  onSaveDraft={saveDraftMutation.mutate}
                  title={projectInfos.title}
                  author={student.data?.name || ''}
                  bannerUrl={bannerUrl}
                  professors={
                    professors.data
                      ?.filter(professor =>
                        projectInfos.professorsIds?.includes(professor.id),
                      )
                      .map(professor => professor.name) || []
                  }
                  publishedYear={projectInfos.publishedYear}
                  semester={projectInfos.semester}
                  subject={
                    subjects.data?.find(
                      subject => subject.id === projectInfos.subjectId,
                    )?.name || undefined
                  }
                  description={projectInfos.description}
                  isPublishing={publishProjectMutation.isPending}
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
              professors.data
                ?.filter(professor =>
                  projectInfos.professorsIds?.includes(professor.id),
                )
                .map(professor => professor.name) || []
            }
            trails={
              trails.data
                ?.filter(trail => projectInfos.trailsIds?.includes(trail.id))
                .map(trail => trail.name) || []
            }
            publishedYear={projectInfos.publishedYear}
            semester={projectInfos.semester}
            subject={
              subjects.data?.find(
                subject => subject.id === projectInfos.subjectId,
              )?.name || undefined
            }
            description={projectInfos.description}
            content={projectInfos.content}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
