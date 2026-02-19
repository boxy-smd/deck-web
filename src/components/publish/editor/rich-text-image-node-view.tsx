'use client'

import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useCallback, useRef } from 'react'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function toPercentWidth(rawWidth: string | null | undefined) {
  const parsed = Number.parseFloat(rawWidth ?? '')
  if (!Number.isFinite(parsed)) {
    return 66
  }
  return clamp(parsed, 20, 100)
}

export function RichTextImageNodeView({
  node,
  selected,
  updateAttributes,
}: NodeViewProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const src = node.attrs.src as string
  const alt = (node.attrs.alt as string) || ''
  const align = (node.attrs.align as 'left' | 'center' | 'right') || 'center'
  const widthPercent = toPercentWidth(node.attrs.width as string)

  const handleResizeStart = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()

      const imageWrapper = wrapperRef.current
      if (!imageWrapper) {
        return
      }

      const editorRoot = imageWrapper.closest('.ProseMirror') as HTMLElement | null
      if (!editorRoot) {
        return
      }

      const editorWidth = editorRoot.clientWidth
      const startWidth = imageWrapper.getBoundingClientRect().width
      const startX = event.clientX

      const onMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX
        const nextWidthPx = clamp(startWidth + delta, 120, editorWidth)
        const nextPercent = clamp((nextWidthPx / editorWidth) * 100, 20, 100)
        updateAttributes({ width: `${Math.round(nextPercent)}%` })
      }

      const onUp = () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }

      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [updateAttributes],
  )

  return (
    <NodeViewWrapper className="my-3 w-full">
      <div
        ref={wrapperRef}
        style={{
          width: `${widthPercent}%`,
          marginLeft: align === 'right' ? 'auto' : align === 'center' ? 'auto' : 0,
          marginRight: align === 'left' ? 'auto' : align === 'center' ? 'auto' : 0,
        }}
        className="group relative"
      >
        {/* biome-ignore lint/performance/noImgElement: tiptap node view needs native img rendering inside editable content */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          className={`block h-auto w-full rounded-sm border ${selected ? 'border-deck-darkest/40' : 'border-transparent'}`}
        />

        {selected && (
          <button
            type="button"
            onMouseDown={handleResizeStart}
            className="absolute right-1 bottom-1 h-4 w-4 cursor-ew-resize rounded-xs border border-white bg-deck-darkest shadow"
            aria-label="Redimensionar imagem"
            tabIndex={-1}
          />
        )}
      </div>
    </NodeViewWrapper>
  )
}
