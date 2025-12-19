import type {
  ProjectDetailsResponseDto,
  ProjectSummaryResponseDto,
} from '@/http/api'
import type { Comment } from './comment'

export type ProjectStatus = 'DRAFT' | 'PUBLISHED'

export type Post = ProjectSummaryResponseDto

export interface Project extends ProjectDetailsResponseDto {
  comments: Comment[]
}

export type Draft = ProjectSummaryResponseDto
