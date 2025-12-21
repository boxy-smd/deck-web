import type { Professor } from '@/entities/professor'
import type { Profile } from '@/entities/profile'
import type { Post } from '@/entities/project'
import type { Student } from '@/entities/student'
import type { Subject } from '@/entities/subject'
import type { Trail } from '@/entities/trail'
import type {
  ProfessorResponseDto,
  ProjectSummaryResponseDto,
  SubjectResponseDto,
  TrailResponseDto,
  UserResponseDto,
  UserSummaryResponseDto,
} from '@/http/api'

export function mapProfessorDtoToProfessor(
  dto: ProfessorResponseDto,
): Professor {
  return dto
}

export function mapSubjectDtoToSubject(dto: SubjectResponseDto): Subject {
  return dto
}

export function mapTrailDtoToTrail(dto: TrailResponseDto): Trail {
  return dto
}

export function mapUserSummaryDtoToStudent(
  dto: UserSummaryResponseDto,
): Student {
  return dto
}

export function mapUserDtoToProfile(dto: UserResponseDto): Profile {
  return dto
}

export function mapProjectSummaryDtoToPost(
  dto: ProjectSummaryResponseDto,
): Post {
  return dto
}
