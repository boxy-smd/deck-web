'use client'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import { useEffect, useRef } from 'react'
import 'highlight.js/styles/atom-one-dark-reasonable.css'

import { useFormContext } from 'react-hook-form'
import type { CreateProjectFormSchema } from '@/hooks/project/use-publish-project'
import { Button } from '../../ui/button'
import { MenuBar } from '../../ui/menubar'
import { Skeleton } from '../../ui/skeleton'

interface EditorProps {
  onNextStep(): void
  onSaveDraft(): void
}

export function DocumentProjectStep({ onNextStep, onSaveDraft }: EditorProps) {
  const { setValue, getValues } = useFormContext<CreateProjectFormSchema>()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
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
    ],
    autofocus: 'start',
    content: getValues('content'),
    editorProps: {
      attributes: {
        class: 'outline-hidden prose-slate prose-base',
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML()
      setValue('content', htmlContent)
    },
  })

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const firstButton = buttonRefs.current[0]

    if (firstButton) {
      firstButton.focus()
    }
  }, [])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-[140px]">
      <div className="flex w-full flex-col items-center justify-center gap-2">
        {editor ? (
          <MenuBar editor={editor} />
        ) : (
          <Skeleton className="h-[40px] w-full animate-pulse rounded-md bg-deck-bg" />
        )}

        <div className="flex w-full items-center justify-center">
          <EditorContent
            onClick={event => {
              event.preventDefault()
              editor?.chain().focus().run()
            }}
            editor={editor}
            placeholder="Digite / para iniciar sua documentação"
            className="prose h-full min-h-[520px] w-full max-w-full rounded-md border border-deck-border bg-deck-bg p-6"
          />
        </div>

        <div className="mt-5 flex w-full flex-row justify-end gap-2">
          <Button onClick={onSaveDraft} size="sm" type="button">
            Salvar Rascunho
          </Button>

          <Button onClick={onNextStep} variant="dark" size="sm">
            Avançar
          </Button>
        </div>
      </div>
    </div>
  )
}
