'use client'

import type { Editor } from '@tiptap/react'
import { Columns3, Minus, Plus, Rows3, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface TableFloatingMenuProps {
  editor: Editor
  container: HTMLDivElement | null
}

type FloatingPosition = {
  top: number
  left: number
  visible: boolean
}

const INITIAL_POSITION: FloatingPosition = {
  top: 0,
  left: 0,
  visible: false,
}

export function TableFloatingMenu({
  editor,
  container,
}: TableFloatingMenuProps) {
  const [position, setPosition] = useState<FloatingPosition>(INITIAL_POSITION)

  const actions = {
    canAddRow: editor.can().chain().focus().addRowAfter().run(),
    canDeleteRow: editor.can().chain().focus().deleteRow().run(),
    canAddColumn: editor.can().chain().focus().addColumnAfter().run(),
    canDeleteColumn: editor.can().chain().focus().deleteColumn().run(),
    canDeleteTable: editor.can().chain().focus().deleteTable().run(),
  }

  useEffect(() => {
    if (!container) {
      setPosition(INITIAL_POSITION)
      return
    }

    const updatePosition = () => {
      if (!(editor.isFocused && editor.isActive('table'))) {
        setPosition(INITIAL_POSITION)
        return
      }

      const { from } = editor.state.selection
      const domAtSelection = editor.view.domAtPos(from).node
      const element =
        domAtSelection instanceof HTMLElement
          ? domAtSelection
          : domAtSelection.parentElement

      const table = element?.closest('table')

      if (!table) {
        setPosition(INITIAL_POSITION)
        return
      }

      const containerRect = container.getBoundingClientRect()
      const tableRect = table.getBoundingClientRect()
      const menuWidth = 40
      const sideGap = 0
      const top = Math.max(8, tableRect.top - containerRect.top)
      let left = tableRect.left - containerRect.left - menuWidth - sideGap

      // Se não houver espaço à esquerda interna, posiciona fora do container.
      if (left < 8) {
        left = -menuWidth - sideGap
      }

      setPosition({
        top,
        left,
        visible: true,
      })
    }

    updatePosition()
    editor.on('selectionUpdate', updatePosition)
    editor.on('update', updatePosition)
    editor.on('focus', updatePosition)
    editor.on('blur', updatePosition)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      editor.off('selectionUpdate', updatePosition)
      editor.off('update', updatePosition)
      editor.off('focus', updatePosition)
      editor.off('blur', updatePosition)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [container, editor])

  const buttonBaseClass =
    'group relative border border-transparent transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-deck-darkest/50'
  const enabledClass = 'hover:scale-105'
  const neutralHoverClass = 'hover:border-slate-200 hover:bg-slate-100'
  const dangerHoverClass = 'hover:border-red-200 hover:bg-red-50'
  const disabledClass = 'cursor-not-allowed opacity-50'

  if (!position.visible) {
    return null
  }

  return (
    <div
      className="absolute z-20 flex flex-col items-center gap-1 rounded-md border border-deck-border bg-white p-1 shadow-md"
      style={{ top: position.top, left: position.left }}
    >
      <Button
        type="button"
        size="icon"
        variant="transparent"
        title="Adicionar linha"
        aria-label="Adicionar linha"
        disabled={!actions.canAddRow}
        className={`h-8 min-w-8 ${buttonBaseClass} ${actions.canAddRow ? `${enabledClass} ${neutralHoverClass}` : disabledClass}`}
        onMouseDown={event => event.preventDefault()}
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        <Rows3 className="size-3.5" />
        <Plus className="size-2.5" />
      </Button>

      <Button
        type="button"
        size="icon"
        variant="transparent"
        title="Remover linha"
        aria-label="Remover linha"
        disabled={!actions.canDeleteRow}
        className={`h-8 min-w-8 ${buttonBaseClass} ${actions.canDeleteRow ? `${enabledClass} ${neutralHoverClass}` : disabledClass}`}
        onMouseDown={event => event.preventDefault()}
        onClick={() => editor.chain().focus().deleteRow().run()}
      >
        <Rows3 className="size-3.5" />
        <Minus className="size-2.5" />
      </Button>

      <Button
        type="button"
        size="icon"
        variant="transparent"
        title="Adicionar coluna"
        aria-label="Adicionar coluna"
        disabled={!actions.canAddColumn}
        className={`h-8 min-w-8 ${buttonBaseClass} ${actions.canAddColumn ? `${enabledClass} ${neutralHoverClass}` : disabledClass}`}
        onMouseDown={event => event.preventDefault()}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        <Columns3 className="size-3.5" />
        <Plus className="size-2.5" />
      </Button>

      <Button
        type="button"
        size="icon"
        variant="transparent"
        title="Remover coluna"
        aria-label="Remover coluna"
        disabled={!actions.canDeleteColumn}
        className={`h-8 min-w-8 ${buttonBaseClass} ${actions.canDeleteColumn ? `${enabledClass} ${neutralHoverClass}` : disabledClass}`}
        onMouseDown={event => event.preventDefault()}
        onClick={() => editor.chain().focus().deleteColumn().run()}
      >
        <Columns3 className="size-3.5" />
        <Minus className="size-2.5" />
      </Button>

      <Button
        type="button"
        size="icon"
        variant="transparent"
        title="Remover tabela"
        aria-label="Remover tabela"
        disabled={!actions.canDeleteTable}
        className={`h-8 min-w-8 ${buttonBaseClass} ${actions.canDeleteTable ? `${enabledClass} ${dangerHoverClass}` : disabledClass}`}
        onMouseDown={event => event.preventDefault()}
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        <Trash2 className="size-3.5 text-red-700" />
      </Button>
    </div>
  )
}
