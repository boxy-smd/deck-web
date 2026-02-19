import type { KeyboardEvent } from 'react'

type Orientation = 'horizontal' | 'vertical'

function getFocusableButtons(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'),
  )
}

export function handleFloatingMenuKeyboardNavigation(
  event: KeyboardEvent<HTMLElement>,
  orientation: Orientation,
) {
  const isHorizontal = orientation === 'horizontal'
  const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'
  const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'

  if (
    ![
      nextKey,
      prevKey,
      'ArrowRight',
      'ArrowLeft',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ].includes(event.key)
  ) {
    return
  }

  const currentTarget = event.currentTarget as HTMLElement
  const buttons = getFocusableButtons(currentTarget)
  if (buttons.length === 0) {
    return
  }

  const activeElement = document.activeElement
  const activeIndex = buttons.indexOf(activeElement as HTMLButtonElement)
  const fallbackIndex = 0

  event.preventDefault()

  if (event.key === 'Home') {
    buttons[0]?.focus()
    return
  }

  if (event.key === 'End') {
    buttons.at(-1)?.focus()
    return
  }

  if ([nextKey, 'ArrowRight', 'ArrowDown'].includes(event.key)) {
    const nextIndex =
      activeIndex >= 0 ? (activeIndex + 1) % buttons.length : fallbackIndex
    buttons[nextIndex]?.focus()
    return
  }

  if ([prevKey, 'ArrowLeft', 'ArrowUp'].includes(event.key)) {
    const prevIndex =
      activeIndex >= 0
        ? (activeIndex - 1 + buttons.length) % buttons.length
        : fallbackIndex
    buttons[prevIndex]?.focus()
  }
}
