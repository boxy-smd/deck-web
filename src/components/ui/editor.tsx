'use client'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import { EditorContent, FloatingMenu, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import { useEffect, useRef } from 'react'
import 'highlight.js/styles/atom-one-dark-reasonable.css'

import type { ProjectInfo } from '@/app/project/[projectid]/edit/page'
import { initialContent } from '@/lib/tiptap'
import { Button } from './button'
import { MenuBar } from './menubar'

interface EditorProps {
  nextStep(): void
  setProjectInfos(projectInfos: ProjectInfo): void
  projectInfos: ProjectInfo
}

export function Editor({
  nextStep,
  setProjectInfos,
  projectInfos,
}: EditorProps) {
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
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'outline-none prose-slate',
      },
    },
  })

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const focusedElement = document.activeElement
    const focusedIndex = buttonRefs.current.findIndex(
      btn => btn === focusedElement,
    )

    if (focusedIndex === -1) {
      return // No button is currently focused
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = (focusedIndex + 1) % buttonRefs.current.length
      buttonRefs.current[nextIndex]?.focus()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      const prevIndex =
        (focusedIndex - 1 + buttonRefs.current.length) %
        buttonRefs.current.length
      buttonRefs.current[prevIndex]?.focus()
    }
  }

  useEffect(() => {
    const firstButton = buttonRefs.current[0]
    if (firstButton) {
      firstButton.focus()
    }
  }, [])

  function handleSubmitEditor() {
    if (editor) {
      const htmlContent = editor.getHTML()
      const updatedData: ProjectInfo = {
        ...projectInfos,
        content: htmlContent,
      }
      setProjectInfos(updatedData)
    }
    nextStep()
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      {editor && <MenuBar editor={editor} />}
      <div className="flex w-full items-center justify-center">
        <EditorContent
          editor={editor}
          placeholder="Digite / para iniciar sua documentação"
          className="prose flex h-full min-h-[520px] w-full max-w-full items-center rounded-md border border-slate-200 bg-slate-100 p-6"
        />

        {editor && (
          <FloatingMenu
            className="flex flex-col overflow-hidden rounded-lg border border-zinc-600 bg-zinc-700 px-1 py-2 shadow-black/20 shadow-xl"
            editor={editor}
            shouldShow={({ state }) => {
              const { $from } = state.selection
              const currentLineText = $from.nodeBefore?.textContent
              return currentLineText === '/'
            }}
          >
            <div className="floating-menu" onKeyDown={handleKeyDown}>
              <Button
                ref={el => {
                  buttonRefs.current[0] = el
                }}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                variant={'dark'}
                className={`flex min-w-[80px] items-center gap-2 rounded p-1 font-bold text-zinc-50 hover:bg-zinc-600 ${
                  editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
                }`}
              >
                H1
              </Button>

              <Button
                ref={el => {
                  buttonRefs.current[1] = el
                }}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                variant={'dark'}
                className={`flex min-w-[80px] items-center gap-2 rounded p-1 font-bold text-zinc-50 hover:bg-zinc-600 ${
                  editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
                }`}
              >
                H2
              </Button>

              <Button
                ref={el => {
                  buttonRefs.current[2] = el
                }}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                variant={'dark'}
                className={`flex min-w-[80px] items-center gap-2 rounded p-1 font-bold text-zinc-50 hover:bg-zinc-600 ${
                  editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
                }`}
              >
                H3
              </Button>

              <Button
                ref={el => {
                  buttonRefs.current[3] = el
                }}
                variant={'dark'}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`flex min-w-[80px] items-center gap-2 rounded p-1 font-bold text-zinc-50 hover:bg-zinc-600 ${
                  editor.isActive('bulletlist') ? 'is-active' : ''
                }`}
              >
                Bullet list
              </Button>
            </div>
          </FloatingMenu>
        )}
      </div>
      <div className="mt-5 flex w-full flex-row justify-end gap-2">
        <Button size="sm">Salvar Rascunho</Button>

        <Button
          onClick={handleSubmitEditor}
          variant="dark"
          type="button"
          size="sm"
        >
          Avançar
        </Button>
      </div>
    </div>
  )
}
