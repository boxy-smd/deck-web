import type { Post } from './project'

export interface Profile {
  id: string
  name: string
  username: string
  semester: number
  about: string
  profileUrl: string
  trails: string[]
  posts: Omit<Post, 'author'>[]
}

export type Student = Omit<Profile, 'about' | 'posts'>
