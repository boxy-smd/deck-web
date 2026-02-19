'use client'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import { useCallback, useEffect, useState } from 'react'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import type { EditorView } from '@tiptap/pm/view'

import { useFormContext } from 'react-hook-form'
import { EditorBubbleMenu } from '@/components/publish/editor/bubble-menu'
import { SlashCommand } from '@/components/publish/editor/slash-command'
import { TableFloatingMenu } from '@/components/publish/editor/table-floating-menu'
import { InlineErrorNotice } from '@/components/ui/inline-error-notice'
import type {
  AutosaveStatus,
  CreateProjectFormSchema,
} from '@/hooks/project/use-publish-project'
import { Button } from '../../ui/button'
import { Kbd, KbdGroup } from '../../ui/kbd'
import { MenuBar } from '../../ui/menubar'
import { Skeleton } from '../../ui/skeleton'

interface EditorProps {
  onNextStep(): void
  onSaveDraft(): void
  isSavingDraft: boolean
  isAdvancing: boolean
  requestError?: string | null
  onDismissRequestError?(): void
  autosaveStatus: AutosaveStatus
  autosaveLastSavedAt: Date | null
  onRetryAutosave(): void | Promise<void>
}

function isImageFile(file: File) {
  return file.type.startsWith('image/')
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

async function insertImages(
  view: EditorView,
  files: File[],
  startPos?: number,
) {
  const imageNodeType = view.state.schema.nodes.image

  if (!imageNodeType) {
    return
  }

  let insertionPos = startPos ?? view.state.selection.from

  for (const file of files) {
    const src = await readFileAsDataUrl(file)
    const imageNode = imageNodeType.create({ src })
    const transaction = view.state.tr.insert(insertionPos, imageNode)
    view.dispatch(transaction)
    insertionPos += imageNode.nodeSize
  }
}

export function DocumentProjectStep({
  onNextStep,
  onSaveDraft,
  isSavingDraft,
  isAdvancing,
  requestError,
  onDismissRequestError,
  autosaveStatus,
  autosaveLastSavedAt,
  onRetryAutosave,
}: EditorProps) {
  const { setValue, getValues, watch } =
    useFormContext<CreateProjectFormSchema>()
  const formContent = watch('content')
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [, forceTick] = useState(0)
  const [isRetryCooldown, setIsRetryCooldown] = useState(false)

  const updateEditorMetrics = useCallback((text: string) => {
    const normalizedText = text.trim()
    const words = normalizedText ? normalizedText.split(/\s+/).length : 0
    const chars = text.replace(/\s/g, '').length

    setWordCount(words)
    setCharCount(chars)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      CodeBlockLowlight.configure({
        lowlight: createLowlight(common),
      }),
      Image,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Digite / para inserir blocos e começar a documentar...',
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      SlashCommand,
    ],
    autofocus: 'start',
    content: getValues('content'),
    editorProps: {
      attributes: {
        class: 'ProseMirror outline-hidden',
      },
      handlePaste: (view, event) => {
        const clipboardFiles = Array.from(event.clipboardData?.files ?? [])
        const imageFiles = clipboardFiles.filter(isImageFile)

        if (imageFiles.length === 0) {
          return false
        }

        event.preventDefault()
        insertImages(view, imageFiles).catch(() => undefined)
        return true
      },
      handleDrop: (view, event, moved) => {
        if (moved) {
          return false
        }

        const droppedFiles = Array.from(event.dataTransfer?.files ?? [])
        const imageFiles = droppedFiles.filter(isImageFile)

        if (imageFiles.length === 0) {
          return false
        }

        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        })

        event.preventDefault()
        insertImages(view, imageFiles, coordinates?.pos).catch(() => undefined)
        return true
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML()
      setValue('content', htmlContent)
      updateEditorMetrics(editor.getText())
    },
  })

  useEffect(() => {
    if (!editor) {
      return
    }

    const normalizedFormContent =
      formContent?.trim() === '<p></p>' ? '' : formContent?.trim() || ''
    const normalizedEditorContent =
      editor.getHTML().trim() === '<p></p>' ? '' : editor.getHTML().trim()

    if (normalizedFormContent === normalizedEditorContent) {
      return
    }

    if (editor.isEmpty || !editor.isFocused) {
      editor.commands.setContent(formContent || '', false)
    }
  }, [editor, formContent])

  useEffect(() => {
    if (!editor) {
      return
    }

    updateEditorMetrics(editor.getText())
  }, [editor, updateEditorMetrics])

  const [editorContainer, setEditorContainer] = useState<HTMLDivElement | null>(
    null,
  )

  useEffect(() => {
    const interval = setInterval(() => {
      forceTick(value => value + 1)
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isRetryCooldown) {
      return
    }

    const timeout = setTimeout(() => {
      setIsRetryCooldown(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [isRetryCooldown])

  async function handleRetryAutosave() {
    if (isRetryCooldown) {
      return
    }

    setIsRetryCooldown(true)
    await onRetryAutosave()
  }

  function formatRelativeTime(date: Date | null) {
    if (!date) {
      return ''
    }

    const diffMs = Date.now() - date.getTime()
    const diffMinutes = Math.max(0, Math.floor(diffMs / 60000))
    if (diffMinutes < 1) {
      return 'agora mesmo'
    }

    const units = [
      { value: 60, label: 'minuto' },
      { value: 24, label: 'hora' },
    ]

    let amount = diffMinutes
    let label = 'dia'

    for (const unit of units) {
      if (amount < unit.value) {
        label = unit.label
        break
      }
      amount = Math.floor(amount / unit.value)
    }

    return `há ${amount} ${label}${amount > 1 ? 's' : ''}`
  }

  const autosaveLabel =
    autosaveStatus === 'saving'
      ? 'Salvando...'
      : autosaveStatus === 'saved'
        ? `Salvo ${formatRelativeTime(autosaveLastSavedAt)}`
        : autosaveStatus === 'error'
          ? 'Erro ao salvar'
          : 'Pronto'

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-[140px]">
      <div className="flex w-full flex-col items-center justify-center gap-2">
        {editor ? (
          <>
            <MenuBar editor={editor} />
            <EditorBubbleMenu editor={editor} />
          </>
        ) : (
          <Skeleton className="h-[40px] w-full animate-pulse rounded-md bg-deck-bg" />
        )}

        <div
          ref={node => {
            setEditorContainer(node)
          }}
          className="relative flex w-full items-center justify-center"
        >
          <EditorContent
            onClick={() => {
              editor?.chain().focus().run()
            }}
            editor={editor}
            className="h-full max-h-[62vh] min-h-[420px] w-full max-w-full overflow-y-auto rounded-md border border-deck-border bg-deck-bg p-6"
          />
          {editor && (
            <TableFloatingMenu
              editor={editor}
              container={editorContainer}
            />
          )}
        </div>

        <div className="mt-2 flex w-full items-center justify-between text-deck-secondary-text text-xs">
          <span>
            {wordCount} palavras • {charCount} caracteres •{' '}
            {Math.max(1, Math.ceil(wordCount / 200))} min de leitura
          </span>
          <div className="flex items-center gap-2" aria-live="polite">
            {autosaveStatus === 'error' && (
              <>
                <span className="text-red-700">Falha no autosave</span>
                <Button
                  type="button"
                  size="sm"
                  className="h-6 rounded-xs px-2 py-1 text-xs"
                  disabled={isRetryCooldown}
                  onClick={handleRetryAutosave}
                >
                  {isRetryCooldown ? 'Aguarde...' : 'Tentar novamente'}
                </Button>
              </>
            )}
            <span>{autosaveLabel}</span>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 text-deck-secondary-text text-xs">
          <KbdGroup>
            <Kbd>/</Kbd>
            <span>Comandos</span>
          </KbdGroup>
          <KbdGroup>
            <Kbd>#</Kbd>
            <span>Títulos</span>
          </KbdGroup>
          <KbdGroup>
            <Kbd>-</Kbd>
            <span>Lista</span>
          </KbdGroup>
          <KbdGroup>
            <Kbd>1.</Kbd>
            <span>Lista numerada</span>
          </KbdGroup>
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>B</Kbd>
            <span>Negrito</span>
          </KbdGroup>
        </div>

        <div className="mt-5 flex w-full flex-row justify-end gap-2">
          {requestError && (
            <InlineErrorNotice
              message={requestError}
              onDismiss={onDismissRequestError}
              className="mr-auto"
            />
          )}

          <Button
            onClick={onSaveDraft}
            size="sm"
            type="button"
            disabled={isSavingDraft}
          >
            {isSavingDraft ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>

          <Button
            onClick={onNextStep}
            variant="dark"
            size="sm"
            type="button"
            disabled={isAdvancing}
          >
            Avançar
          </Button>
        </div>
      </div>
    </div>
  )
}
