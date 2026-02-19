import type { TrailResponseDto } from '@/http/api'

export type Trail = TrailResponseDto & {
  color?: string
  icon?: string
}
