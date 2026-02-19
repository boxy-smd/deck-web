'use client'

import type { ReactNode, SyntheticEvent } from 'react'
import { cloneElement, isValidElement } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type TooltipSide = 'top' | 'right'

interface ActionTooltipProps {
  label: string
  side?: TooltipSide
  children: ReactNode
}

type ChildEvent = SyntheticEvent<HTMLElement>
type TooltipTriggerProps = {
  onMouseEnter?: (event: ChildEvent) => void
  onMouseLeave?: (event: ChildEvent) => void
  onFocus?: (event: ChildEvent) => void
  onBlur?: (event: ChildEvent) => void
}

function mergeEventHandlers(
  first?: (event: ChildEvent) => void,
  second?: (event: ChildEvent) => void,
) {
  return (event: ChildEvent) => {
    first?.(event)
    second?.(event)
  }
}

export function ActionTooltip({
  label,
  side = 'top',
  children,
}: ActionTooltipProps) {
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const tooltipClassName = useMemo(
    () =>
      'pointer-events-none fixed z-40 whitespace-nowrap rounded bg-deck-darkest px-2 py-1 text-[10px] text-deck-bg opacity-0 shadow transition-opacity duration-150',
    [],
  )

  useEffect(() => {
    if (!isVisible) {
      return
    }

    const updatePosition = () => {
      const trigger = triggerRef.current
      if (!trigger) {
        return
      }

      const rect = trigger.getBoundingClientRect()
      if (side === 'right') {
        setPosition({
          top: rect.top + rect.height / 2,
          left: rect.right + 8,
        })
        return
      }

      setPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isVisible, side])

  const enhancedChild =
    isValidElement<TooltipTriggerProps>(children) &&
    cloneElement(children, {
      onMouseEnter: mergeEventHandlers(
        children.props.onMouseEnter,
        () => setIsVisible(true),
      ),
      onMouseLeave: mergeEventHandlers(
        children.props.onMouseLeave,
        () => setIsVisible(false),
      ),
      onFocus: mergeEventHandlers(
        children.props.onFocus,
        () => setIsVisible(true),
      ),
      onBlur: mergeEventHandlers(
        children.props.onBlur,
        () => setIsVisible(false),
      ),
    })

  return (
    <div ref={triggerRef} className="group relative">
      {enhancedChild || children}
      {typeof document !== 'undefined' &&
        createPortal(
          <span
            className={`${tooltipClassName} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{
              top: position.top,
              left: position.left,
              transform:
                side === 'right'
                  ? 'translateY(-50%)'
                  : 'translate(-50%, -100%)',
            }}
          >
            {label}
          </span>,
          document.body,
        )}
    </div>
  )
}
