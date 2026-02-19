'use client'

import type { Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  CaseSensitive,
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  RectangleHorizontal,
  Strikethrough,
  Trash2,
} from 'lucide-react'
import type { MouseEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ActionTooltip } from '@/components/publish/editor/action-tooltip'
import { handleFloatingMenuKeyboardNavigation } from '@/components/publish/editor/floating-menu-keyboard'
import {
  setStoredImagePreferences,
  type ImageAlignOption,
  type ImageWidthOption,
} from '@/components/publish/editor/image-preferences'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EditorBubbleMenuProps {
  editor: Editor
  container: HTMLDivElement | null
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: menu renders two specialized toolsets based on current selection
export function EditorBubbleMenu({ editor, container }: EditorBubbleMenuProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [, setViewportTick] = useState(0)
  const animationFrameRef = useRef<number | null>(null)
  const imageWidth = editor.getAttributes('image').width || '66%'
  const imageAlign = editor.getAttributes('image').align || 'center'

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mediaQuery.matches)
    sync()
    mediaQuery.addEventListener('change', sync)

    return () => mediaQuery.removeEventListener('change', sync)
  }, [])

  function setImageWidth(width: ImageWidthOption) {
    editor.chain().focus().updateAttributes('image', { width }).run()
    setStoredImagePreferences({ width })
  }

  function setImageAlign(align: ImageAlignOption) {
    editor.chain().focus().updateAttributes('image', { align }).run()
    setStoredImagePreferences({ align })
  }

  function preserveSelection(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
  }

  function editImageAlt() {
    const currentAlt = editor.getAttributes('image').alt || ''
    const nextAlt = window.prompt('Texto alternativo da imagem', currentAlt)

    if (nextAlt === null) {
      return
    }

    editor.chain().focus().updateAttributes('image', { alt: nextAlt }).run()
  }

  function removeImage() {
    editor.chain().focus().deleteSelection().run()
  }

  function isSelectedImageVisibleInEditorViewport() {
    const editorViewport = container
    const selectedImage = editor.view.dom.querySelector(
      'img.ProseMirror-selectednode',
    )

    if (!(editorViewport && selectedImage instanceof HTMLElement)) {
      return false
    }

    const viewportRect = editorViewport.getBoundingClientRect()
    const imageRect = selectedImage.getBoundingClientRect()

    const verticallyVisible =
      imageRect.bottom > viewportRect.top && imageRect.top < viewportRect.bottom
    const horizontallyVisible =
      imageRect.right > viewportRect.left && imageRect.left < viewportRect.right

    return verticallyVisible && horizontallyVisible
  }

  function isSelectionVisibleInEditorViewport(currentEditor: Editor) {
    const editorViewport = container
    if (!editorViewport) {
      return false
    }

    const { from, to } = currentEditor.state.selection
    const fromCoords = currentEditor.view.coordsAtPos(from)
    const toCoords = currentEditor.view.coordsAtPos(to)
    const viewportRect = editorViewport.getBoundingClientRect()

    const selectionTop = Math.min(fromCoords.top, toCoords.top)
    const selectionBottom = Math.max(fromCoords.bottom, toCoords.bottom)
    const selectionLeft = Math.min(fromCoords.left, toCoords.left)
    const selectionRight = Math.max(fromCoords.right, toCoords.right)

    const verticallyVisible =
      selectionBottom > viewportRect.top && selectionTop < viewportRect.bottom
    const horizontallyVisible =
      selectionRight > viewportRect.left && selectionLeft < viewportRect.right

    return verticallyVisible && horizontallyVisible
  }

  const bubbleTippyOptions = {
    duration: [180, 120] as [number, number],
    animation: 'shift-away-subtle',
    inertia: true,
    moveTransition: 'transform 0.15s ease-out',
    theme: 'editor-bubble-menu',
    arrow: false,
    maxWidth: 'none' as const,
    zIndex: 20,
    appendTo: () => container ?? document.body,
    popperOptions: {
      strategy: 'absolute' as const,
      modifiers: [
        {
          name: 'preventOverflow',
          options: {
            boundary: container ?? undefined,
            padding: 8,
          },
        },
      ],
    },
  }

  useEffect(() => {
    const editorViewport = container
    if (!editorViewport) {
      return
    }

    const refresh = () => {
      if (animationFrameRef.current !== null) {
        return
      }

      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null
        setViewportTick(value => value + 1)
      })
    }

    editorViewport.addEventListener('scroll', refresh, { passive: true })
    window.addEventListener('scroll', refresh, true)
    window.addEventListener('resize', refresh)
    editor.on('selectionUpdate', refresh)
    editor.on('update', refresh)
    editor.on('focus', refresh)
    editor.on('blur', refresh)

    return () => {
      editorViewport.removeEventListener('scroll', refresh)
      window.removeEventListener('scroll', refresh, true)
      window.removeEventListener('resize', refresh)
      editor.off('selectionUpdate', refresh)
      editor.off('update', refresh)
      editor.off('focus', refresh)
      editor.off('blur', refresh)
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [container, editor])

  if (editor.isActive('image')) {
    return (
      <BubbleMenu
        editor={editor}
        tippyOptions={bubbleTippyOptions}
        shouldShow={({ editor: currentEditor }) =>
          currentEditor.isFocused &&
          currentEditor.isActive('image') &&
          isSelectionVisibleInEditorViewport(currentEditor) &&
          isSelectedImageVisibleInEditorViewport()
        }
        className="flex items-center gap-1 rounded-md border border-deck-border bg-white p-1 shadow-md"
      >
        <div
          role="toolbar"
          aria-label="Menu contextual de imagem"
          onKeyDown={event =>
            handleFloatingMenuKeyboardNavigation(event, 'horizontal')
          }
          className="flex items-center gap-1"
        >
          <ActionTooltip label="Imagem pequena">
          <Button
            type="button"
            size="icon"
            variant={imageWidth === '33%' ? 'default' : 'transparent'}
            className={cn(
              'rounded-md border border-transparent transition-all hover:scale-105 hover:border-slate-200 hover:bg-slate-100',
              isMobile ? 'h-9 w-9' : 'h-8 w-8',
            )}
            onMouseDown={preserveSelection}
            onClick={() => setImageWidth('33%')}
          >
            <RectangleHorizontal className="size-3" />
          </Button>
          </ActionTooltip>

          <ActionTooltip label="Imagem média">
          <Button
            type="button"
            size="icon"
            variant={imageWidth === '66%' ? 'default' : 'transparent'}
            className={cn(
              'rounded-md border border-transparent transition-all hover:scale-105 hover:border-slate-200 hover:bg-slate-100',
              isMobile ? 'h-9 w-9' : 'h-8 w-8',
            )}
            onMouseDown={preserveSelection}
            onClick={() => setImageWidth('66%')}
          >
            <RectangleHorizontal className="size-4" />
          </Button>
          </ActionTooltip>

          <ActionTooltip label="Imagem grande">
          <Button
            type="button"
            size="icon"
            variant={imageWidth === '100%' ? 'default' : 'transparent'}
            className={cn(
              'rounded-md border border-transparent transition-all hover:scale-105 hover:border-slate-200 hover:bg-slate-100',
              isMobile ? 'h-9 w-9' : 'h-8 w-8',
            )}
            onMouseDown={preserveSelection}
            onClick={() => setImageWidth('100%')}
          >
            <RectangleHorizontal className="size-5" />
          </Button>
          </ActionTooltip>

          {!isMobile && <div className="mx-1 h-6 w-px border border-slate-200" />}

          {!isMobile && (
            <ActionTooltip label="Alinhar à esquerda">
          <Button
            type="button"
            size="icon"
            variant={imageAlign === 'left' ? 'default' : 'transparent'}
            className="h-8 w-8 rounded-md border border-transparent transition-all hover:scale-105 hover:border-slate-200 hover:bg-slate-100"
            onMouseDown={preserveSelection}
            onClick={() => setImageAlign('left')}
          >
            <AlignLeft className="size-4" />
          </Button>
            </ActionTooltip>
          )}

          <ActionTooltip label="Centralizar">
          <Button
            type="button"
            size="icon"
            variant={imageAlign === 'center' ? 'default' : 'transparent'}
            className={cn(
              'rounded-md border border-transparent transition-all hover:scale-105 hover:border-slate-200 hover:bg-slate-100',
              isMobile ? 'h-9 w-9' : 'h-8 w-8',
            )}
            onMouseDown={preserveSelection}
            onClick={() => setImageAlign('center')}
          >
            <AlignCenter className="size-4" />
          </Button>
          </ActionTooltip>

          <ActionTooltip label="Alinhar à direita">
          <Button
            type="button"
            size="icon"
            variant={imageAlign === 'right' ? 'default' : 'transparent'}
            className={cn(
              'rounded-md border border-transparent transition-all hover:scale-105 hover:border-slate-200 hover:bg-slate-100',
              isMobile ? 'h-9 w-9' : 'h-8 w-8',
            )}
            onMouseDown={preserveSelection}
            onClick={() => setImageAlign('right')}
          >
            <AlignRight className="size-4" />
          </Button>
          </ActionTooltip>

          {!isMobile && <div className="mx-1 h-6 w-px border border-slate-200" />}

          {!isMobile && (
            <ActionTooltip label="Editar texto alternativo">
          <Button
            type="button"
            size="icon"
            variant="transparent"
            className="h-8 w-8 rounded-md border border-transparent transition-all hover:scale-105 hover:border-slate-200 hover:bg-slate-100"
            onMouseDown={preserveSelection}
            onClick={editImageAlt}
          >
            <CaseSensitive className="size-4" />
          </Button>
            </ActionTooltip>
          )}

          <ActionTooltip label="Remover imagem">
          <Button
            type="button"
            size="icon"
            variant="transparent"
            className={cn(
              'rounded-md border border-transparent transition-all hover:scale-105 hover:border-red-200 hover:bg-red-50',
              isMobile ? 'h-9 w-9' : 'h-8 w-8',
            )}
            onMouseDown={preserveSelection}
            onClick={removeImage}
          >
            <Trash2 className="size-4 text-red-700" />
          </Button>
          </ActionTooltip>
        </div>
      </BubbleMenu>
    )
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={bubbleTippyOptions}
      shouldShow={({ editor: currentEditor }) =>
        currentEditor.isFocused &&
        !currentEditor.isActive('table') &&
        !currentEditor.state.selection.empty &&
        isSelectionVisibleInEditorViewport(currentEditor)
      }
      className="flex items-center gap-1 rounded-md border border-deck-border bg-white p-1 shadow-md"
    >
      <div
        role="toolbar"
        aria-label="Menu contextual de texto"
        onKeyDown={event =>
          handleFloatingMenuKeyboardNavigation(event, 'horizontal')
        }
        className="flex items-center gap-1"
      >
        <ActionTooltip label="Negrito">
        <Button
          type="button"
          size="icon"
          variant={editor.isActive('bold') ? 'default' : 'transparent'}
          className={cn(
            'rounded-md border border-transparent transition-all hover:scale-105 hover:border-slate-200 hover:bg-slate-100',
            isMobile ? 'h-9 w-9' : 'h-8 w-8',
          )}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </Button>
        </ActionTooltip>

        <ActionTooltip label="Itálico">
        <Button
          type="button"
          size="icon"
          variant={editor.isActive('italic') ? 'default' : 'transparent'}
          className={cn(
            'rounded-md border border-transparent transition-all hover:scale-105 hover:border-slate-200 hover:bg-slate-100',
            isMobile ? 'h-9 w-9' : 'h-8 w-8',
          )}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </Button>
        </ActionTooltip>

        {!isMobile && <ActionTooltip label="Riscado">
        <Button
          type="button"
          size="icon"
          variant={editor.isActive('strike') ? 'default' : 'transparent'}
          className="h-8 w-8 rounded-md border border-transparent transition-all hover:scale-105 hover:border-slate-200 hover:bg-slate-100"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="size-4" />
        </Button>
        </ActionTooltip>}

        <ActionTooltip label="Título 1">
        <Button
          type="button"
          size="icon"
          variant={
            editor.isActive('heading', { level: 1 }) ? 'default' : 'transparent'
          }
          className={cn(
            'rounded-md border border-transparent transition-all hover:scale-105 hover:border-slate-200 hover:bg-slate-100',
            isMobile ? 'h-9 w-9' : 'h-8 w-8',
          )}
          onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
        >
          <Heading1 className="size-4" />
        </Button>
        </ActionTooltip>

        {!isMobile && <ActionTooltip label="Título 2">
        <Button
          type="button"
          size="icon"
          variant={
            editor.isActive('heading', { level: 2 }) ? 'default' : 'transparent'
          }
          className="h-8 w-8 rounded-md border border-transparent transition-all hover:scale-105 hover:border-slate-200 hover:bg-slate-100"
          onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
        >
          <Heading2 className="size-4" />
        </Button>
        </ActionTooltip>}

        <ActionTooltip label="Lista com marcadores">
        <Button
          type="button"
          size="icon"
          variant={editor.isActive('bulletList') ? 'default' : 'transparent'}
          className={cn(
            'rounded-md border border-transparent transition-all hover:scale-105 hover:border-slate-200 hover:bg-slate-100',
            isMobile ? 'h-9 w-9' : 'h-8 w-8',
          )}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
        </Button>
        </ActionTooltip>

        <ActionTooltip label="Lista numerada">
        <Button
          type="button"
          size="icon"
          variant={editor.isActive('orderedList') ? 'default' : 'transparent'}
          className={cn(
            'rounded-md border border-transparent transition-all hover:scale-105 hover:border-slate-200 hover:bg-slate-100',
            isMobile ? 'h-9 w-9' : 'h-8 w-8',
          )}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
        </Button>
        </ActionTooltip>
      </div>
    </BubbleMenu>
  )
}
