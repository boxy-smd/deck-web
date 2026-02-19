export type ImageWidthOption = '33%' | '66%' | '100%'
export type ImageAlignOption = 'left' | 'center' | 'right'

export interface ImagePreferences {
  width: ImageWidthOption
  align: ImageAlignOption
}

const IMAGE_PREFERENCES_STORAGE_KEY = 'deck:editor:image-preferences'

const DEFAULT_IMAGE_PREFERENCES: ImagePreferences = {
  width: '66%',
  align: 'center',
}

function isWidthOption(value: unknown): value is ImageWidthOption {
  return value === '33%' || value === '66%' || value === '100%'
}

function isAlignOption(value: unknown): value is ImageAlignOption {
  return value === 'left' || value === 'center' || value === 'right'
}

export function getStoredImagePreferences(): ImagePreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_IMAGE_PREFERENCES
  }

  const raw = window.localStorage.getItem(IMAGE_PREFERENCES_STORAGE_KEY)
  if (!raw) {
    return DEFAULT_IMAGE_PREFERENCES
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ImagePreferences>
    return {
      width: isWidthOption(parsed.width)
        ? parsed.width
        : DEFAULT_IMAGE_PREFERENCES.width,
      align: isAlignOption(parsed.align)
        ? parsed.align
        : DEFAULT_IMAGE_PREFERENCES.align,
    }
  } catch {
    return DEFAULT_IMAGE_PREFERENCES
  }
}

export function setStoredImagePreferences(
  nextPreferences: Partial<ImagePreferences>,
) {
  if (typeof window === 'undefined') {
    return
  }

  const current = getStoredImagePreferences()
  const merged: ImagePreferences = {
    width: isWidthOption(nextPreferences.width)
      ? nextPreferences.width
      : current.width,
    align: isAlignOption(nextPreferences.align)
      ? nextPreferences.align
      : current.align,
  }

  window.localStorage.setItem(
    IMAGE_PREFERENCES_STORAGE_KEY,
    JSON.stringify(merged),
  )
}

