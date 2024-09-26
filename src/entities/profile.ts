import type { Draft, Post } from './project'

export interface Profile {
  id: string
  name: string
  username: string
  semester: number
  about: string
  profileUrl: string
  trails: string[]
  posts: Omit<Post, 'author' | 'authorId' | 'status'>[]
  drafts: Draft[]
}

export type Student = Omit<Profile, 'about' | 'posts'>
