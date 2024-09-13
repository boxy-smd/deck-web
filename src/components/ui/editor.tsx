'use client'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import { useEffect, useRef } from 'react'
import type React from 'react'
import {
  RxCode,
  RxFontBold,
  RxFontItalic,
  RxStrikethrough,
} from 'react-icons/rx'
import 'highlight.js/styles/atom-one-dark-reasonable.css'

import { initialContent } from '@/lib/tiptap'
import { BubbleButton } from './bubble-button'
import { Button } from './button'
import { MenuBar } from './menubar'

export function Editor() {
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

      if (buttonRefs.current[nextIndex]) {
        buttonRefs.current[nextIndex]?.focus()
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()

      const prevIndex =
        (focusedIndex - 1 + buttonRefs.current.length) %
        buttonRefs.current.length

      if (buttonRefs.current[prevIndex]) {
        buttonRefs.current[prevIndex]?.focus()
      }
    }
  }

  useEffect(() => {
    const firstButton = buttonRefs.current[0]
    if (firstButton) {
      firstButton.focus()
    }
  }, [])

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      {editor && <MenuBar editor={editor} />}

      <div className="flex w-full items-center justify-center">
        <EditorContent
          editor={editor}
          placeholder="Digite / para iniciar sua documentação"
          className="prose h-full min-h-[520px] w-full max-w-full rounded-md border border-slate-200 bg-slate-100 p-6"
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

        {editor && (
          <BubbleMenu
            className="divide flex divide-zinc-600 overflow-hidden rounded-lg border border-zinc-600 bg-zinc-700 shadow-black/20 shadow-xl"
            editor={editor}
          >
            <BubbleButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              className="flex items-center p-2 font-medium text-sm text-zinc-200 leading-none hover:bg-zinc-600 hover:text-zinc-50"
            >
              <RxFontBold className="size-5" />
            </BubbleButton>

            <BubbleButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className="flex items-center p-2 font-medium text-sm text-zinc-200 leading-none hover:bg-zinc-600 hover:text-zinc-50"
            >
              <RxFontItalic className="size-5" />
            </BubbleButton>

            <BubbleButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className="flex items-center p-2 font-medium text-sm text-zinc-200 leading-none hover:bg-zinc-600 hover:text-zinc-50"
            >
              <RxStrikethrough className="size-5" />
            </BubbleButton>

            <BubbleButton
              onClick={() => editor.commands.toggleCodeBlock()}
              className="flex items-center p-2 font-medium text-sm text-zinc-200 leading-none hover:bg-zinc-600 hover:text-zinc-50"
            >
              <RxCode className="size-5" />
            </BubbleButton>
          </BubbleMenu>
        )}
      </div>
    </div>
  )
}
