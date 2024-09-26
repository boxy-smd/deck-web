import type { Draft } from '@/entities/project'
import type { CreateProjectFormSchema } from '@/hooks/project/use-publish-project'
import { instance } from '@/lib/axios'

export async function getDraftDetails(draftId: string) {
  const { data } = await instance.get<{
    draft: Draft
  }>(`/drafts/${draftId}`)

  return data.draft
}

export async function saveDraft(
  draftId: string,
  project: CreateProjectFormSchema,
) {
  await instance.put(`/drafts/${draftId}`, {
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
}
