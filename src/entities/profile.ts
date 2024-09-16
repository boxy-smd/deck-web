import type { Post } from './project'
import type { Trail } from './trail'

export interface Profile {
  id: string
  name: string
  username: string
  semester: number
  about: string
  profileUrl: string
  trails: Trail[]
  posts: Post[]
}

export type Student = Omit<Profile, 'about' | 'posts'>
