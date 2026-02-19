import type { ElementType } from 'react'
import { Audiovisual } from '@/components/assets/audiovisual'
import { Design } from '@/components/assets/design'
import { Games } from '@/components/assets/games'
import { SMD } from '@/components/assets/smd'
import { Systems } from '@/components/assets/systems'
import type { Trail } from '@/entities/trail'
import { cn } from '@/lib/utils'

export type TrailConfig = {
  icon: ElementType
  color: string
  textColor: string
  bgColor: string
  bgDarkColor: string
}

const ICON_COMPONENTS: Record<string, ElementType> = {
  Design,
  Sistemas: Systems,
  Audiovisual,
  Jogos: Games,
  SMD,
}

const TRAILS_CONFIG: Record<string, TrailConfig> = {
  Design: {
    icon: Design,
    color: '#D41919',
    textColor: cn('text-deck-red-dark'),
    bgColor: cn('bg-deck-red-light'),
    bgDarkColor: cn('bg-deck-red'),
  },
  Sistemas: {
    icon: Systems,
    color: '#0581C4',
    textColor: cn('text-deck-blue-dark'),
    bgColor: cn('bg-deck-blue-light'),
    bgDarkColor: cn('bg-deck-blue'),
  },
  Audiovisual: {
    icon: Audiovisual,
    color: '#E99700',
    textColor: cn('text-deck-orange-dark'),
    bgColor: cn('bg-deck-orange-light'),
    bgDarkColor: cn('bg-deck-orange'),
  },
  Jogos: {
    icon: Games,
    color: '#5BAD5E',
    textColor: cn('text-deck-green-dark'),
    bgColor: cn('bg-deck-green-light'),
    bgDarkColor: cn('bg-deck-green'),
  },
  SMD: {
    icon: SMD,
    color: '#8B00D0',
    textColor: cn('text-deck-purple-dark'),
    bgColor: cn('bg-deck-purple-light'),
    bgDarkColor: cn('bg-deck-purple'),
  },
}

const DEFAULT_CONFIG: TrailConfig = {
  icon: Design,
  color: '#70677B',
  textColor: cn('text-deck-placeholder'),
  bgColor: cn('bg-deck-clear-tone'),
  bgDarkColor: cn('bg-deck-placeholder'),
}

/**
 * Obtém a configuração de uma trilha com base no nome
 * Prioriza dados do backend quando disponíveis, senão usa configuração local
 */
export function getTrailConfig(trailName: string, trail?: Trail): TrailConfig {
  const baseConfig = TRAILS_CONFIG[trailName] ?? DEFAULT_CONFIG

  // Se o backend enviar color e icon, use-os (preparado para futuro)
  if (trail?.color && trail?.icon) {
    return {
      ...baseConfig,
      color: trail.color,
      icon: ICON_COMPONENTS[trail.icon] ?? baseConfig.icon,
    }
  }

  return baseConfig
}

/**
 * Retorna a configuração para múltiplas trilhas (SMD)
 */
export function getMultiTrailConfig(): TrailConfig {
  return TRAILS_CONFIG.SMD
}

/**
 * Obtém a configuração baseada em um array de trilhas
 * Se mais de uma trilha, retorna SMD
 */
export function getTrailConfigFromArray(trails: Trail[]): TrailConfig {
  if (trails.length === 0) {
    return DEFAULT_CONFIG
  }
  if (trails.length > 1) {
    return getMultiTrailConfig()
  }
  return getTrailConfig(trails[0].name, trails[0])
}
