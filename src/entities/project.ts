import type { Comment } from './comment'
import type { Professor } from './professor'
import type { Trail } from './trail'

export type ProjectStatus = 'DRAFT' | 'PUBLISHED'

export interface Project {
  id: string
  title: string
  description: string
  bannerUrl: string
  content: string
  publishedYear: number
  status: ProjectStatus
  semester: number
  createdAt: Date
  updatedAt: Date
  authorId: string
  author: {
    name: string
    username: string
    profileUrl: string
  }
  subjectId: string
  subject: string
  trails: Trail[]
  professors: Professor[]
  comments: Comment[]
}

export type Post = Omit<Project, 'comments'>
