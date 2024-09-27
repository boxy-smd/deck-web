import type { Post, Project } from '@/entities/project'
import type { CreateProjectFormSchema } from '@/hooks/project/use-publish-project'
import { instance } from '@/lib/axios'

export async function getProjectDetails(id: string) {
  const { data } = await instance.get<{
    project: Project
  }>(`/projects/${id}`)

  return data.project
}

export async function fetchPosts() {
  const { data } = await instance.get<{
    posts: Post[]
  }>('/projects')

  return data.posts
}

export async function filterPosts(filterParams: string) {
  const { data } = await instance.get<{
    posts: Post[]
  }>(`/projects/filter?${filterParams}`)

  return data.posts
}

export async function searchPosts(searchQuery: string) {
  const { data } = await instance.get<{
    posts: Post[]
  }>(`/projects/search?${searchQuery}`)
  return data.posts
}

export async function publishProject(
  project: CreateProjectFormSchema,
  draftId: string | null,
) {
  const { data } = await instance.post<{
    project_id: string
  }>('/projects', {
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

  return data.project_id
}

export async function uploadProjectBanner(
  formData: FormData,
  projectId: string,
) {
  console.log(formData)

  const { data } = await instance.postForm<{
    url: string
  }>(`/banners/${projectId}`, formData)

  return data.url
}

export async function deleteProject(id: string) {
  await instance.delete(`/projects/${id}`)
}
