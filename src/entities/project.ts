import type { Comment } from './comment'

export type ProjectStatus = 'DRAFT' | 'PUBLISHED'

export interface Draft {
  id: string
  title: string
  description: string
  bannerUrl: string
  content: string
  publishedYear: number
  semester: number
  allowComments: true
  createdAt: Date
  updatedAt: Date
  subjectId: string
  trailsIds: string[]
  professorsIds: string[]
}

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
  trails: string[]
  professors: string[]
  comments: Comment[]
}

export type Post = Omit<Project, 'content' | 'comments'>
