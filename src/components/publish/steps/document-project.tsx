'use client'

import { mergeAttributes } from '@tiptap/core'
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
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import { EditorContent, ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import { useCallback, useEffect, useState } from 'react'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import type { EditorView } from '@tiptap/pm/view'

import { useFormContext } from 'react-hook-form'
import { EditorBubbleMenu } from '@/components/publish/editor/bubble-menu'
import { RichTextImageNodeView } from '@/components/publish/editor/rich-text-image-node-view'
import { SlashCommand } from '@/components/publish/editor/slash-command'
import { TableFloatingMenu } from '@/components/publish/editor/table-floating-menu'
import { getStoredImagePreferences } from '@/components/publish/editor/image-preferences'
import { InlineErrorNotice } from '@/components/ui/inline-error-notice'
import type {
  AutosaveStatus,
  CreateProjectFormSchema,
} from '@/hooks/project/use-publish-project'
import { useProjectsControllerUploadRichTextImage } from '@/http/api'
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

const RichTextImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: '66%',
        parseHTML: element =>
          element.getAttribute('data-width') ||
          element.style.width ||
          '66%',
        renderHTML: attributes => ({
          'data-width': attributes.width,
        }),
      },
      align: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-align') || 'center',
        renderHTML: attributes => ({
          'data-align': attributes.align,
        }),
      },
    }
  },
  renderHTML({ node, HTMLAttributes }) {
    const width = node.attrs.width || '66%'
    const align = node.attrs.align || 'center'
    const alignStyle =
      align === 'left'
        ? 'margin: 0.75rem auto 0.75rem 0;'
        : align === 'right'
          ? 'margin: 0.75rem 0 0.75rem auto;'
          : 'margin: 0.75rem auto;'

    return [
      'img',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        style: `display:block;max-width:100%;height:auto;width:${width};${alignStyle}`,
      }),
    ]
  },
  addNodeView() {
    return ReactNodeViewRenderer(RichTextImageNodeView)
  },
})

async function insertImages(
  view: EditorView,
  files: File[],
  uploadImage: (file: File) => Promise<string>,
  imagePreferences: { width: string; align: string },
  startPos?: number,
) {
  const imageNodeType = view.state.schema.nodes.image

  if (!imageNodeType) {
    return
  }

  let insertionPos = startPos ?? view.state.selection.from

  for (const file of files) {
    const src = await uploadImage(file)

    const imageNode = imageNodeType.create({
      src,
      width: imagePreferences.width,
      align: imagePreferences.align,
    })
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
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const { mutateAsync: uploadRichTextImage, isPending: isUploadingImage } =
    useProjectsControllerUploadRichTextImage()

  const updateEditorMetrics = useCallback((text: string) => {
    const normalizedText = text.trim()
    const words = normalizedText ? normalizedText.split(/\s+/).length : 0
    const chars = text.replace(/\s/g, '').length

    setWordCount(words)
    setCharCount(chars)
  }, [])

  const uploadImageFile = useCallback(
    async (file: File) => {
      const response = await uploadRichTextImage({
        data: { file },
      })

      if (!response.url) {
        throw new Error('URL da imagem nao retornada pela API.')
      }

      return response.url
    },
    [uploadRichTextImage],
  )

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
      RichTextImage,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
      }),
      Underline,
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
        setImageUploadError(null)
        insertImages(
          view,
          imageFiles,
          uploadImageFile,
          getStoredImagePreferences(),
        ).catch(() => {
          setImageUploadError(
            'Nao foi possivel enviar uma ou mais imagens. Tente novamente.',
          )
        })
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
        setImageUploadError(null)
        insertImages(
          view,
          imageFiles,
          uploadImageFile,
          getStoredImagePreferences(),
          coordinates?.pos,
        ).catch(
          () => {
            setImageUploadError(
              'Nao foi possivel enviar uma ou mais imagens. Tente novamente.',
            )
          },
        )
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
    <div className="flex h-full w-full flex-col items-center justify-center px-2 pb-24 lg:px-[140px] lg:pb-0">
      <div className="flex w-full flex-col items-center justify-center gap-2">
        {editor ? (
          <>
            <div className="hidden w-full md:block">
              <MenuBar editor={editor} />
            </div>
            <div className="fixed right-2 bottom-2 left-2 z-30 rounded-xl border border-deck-border bg-deck-bg/95 shadow-lg backdrop-blur-sm md:hidden">
              <MenuBar editor={editor} mobile />
            </div>
          </>
        ) : (
          <Skeleton className="h-[40px] w-full animate-pulse rounded-md bg-deck-bg" />
        )}

        <div
          ref={node => {
            setEditorContainer(node)
          }}
          className="relative flex max-h-[58vh] min-h-[360px] w-full items-start justify-center overflow-y-auto rounded-md border border-deck-border bg-deck-bg p-3 lg:max-h-[62vh] lg:min-h-[420px] lg:p-6"
        >
          {editor && (
            <EditorBubbleMenu
              editor={editor}
              container={editorContainer}
            />
          )}
          <EditorContent
            onClick={() => {
              editor?.chain().focus().run()
            }}
            editor={editor}
            className="h-full w-full max-w-full"
          />
          {editor && (
            <TableFloatingMenu
              editor={editor}
              container={editorContainer}
            />
          )}
        </div>

        <div className="mt-2 flex w-full flex-col items-start gap-1 text-deck-secondary-text text-xs sm:flex-row sm:items-center sm:justify-between">
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
            {isUploadingImage && <span>Enviando imagem...</span>}
            <span>{autosaveLabel}</span>
          </div>
        </div>

        {imageUploadError && (
          <InlineErrorNotice
            message={imageUploadError}
            onDismiss={() => setImageUploadError(null)}
          />
        )}

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

        <div className="mt-5 flex w-full flex-col-reverse justify-end gap-2 sm:flex-row">
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
