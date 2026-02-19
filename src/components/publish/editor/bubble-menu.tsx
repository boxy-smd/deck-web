'use client'

import type { Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react'
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EditorBubbleMenuProps {
  editor: Editor
}

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 150,
        theme: 'editor-bubble-menu',
        arrow: false,
      }}
      shouldShow={({ editor: currentEditor }) =>
        currentEditor.isFocused &&
        !currentEditor.isActive('table') &&
        !currentEditor.state.selection.empty
      }
      className="flex items-center gap-1 rounded-md border border-deck-border bg-white p-1 shadow-md"
    >
      <Button
        type="button"
        size="icon"
        variant={editor.isActive('bold') ? 'default' : 'transparent'}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </Button>

      <Button
        type="button"
        size="icon"
        variant={editor.isActive('italic') ? 'default' : 'transparent'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </Button>

      <Button
        type="button"
        size="icon"
        variant={editor.isActive('strike') ? 'default' : 'transparent'}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-4" />
      </Button>

      <Button
        type="button"
        size="icon"
        variant={
          editor.isActive('heading', { level: 1 }) ? 'default' : 'transparent'
        }
        onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
      >
        <Heading1 className="size-4" />
      </Button>

      <Button
        type="button"
        size="icon"
        variant={
          editor.isActive('heading', { level: 2 }) ? 'default' : 'transparent'
        }
        onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
      >
        <Heading2 className="size-4" />
      </Button>

      <Button
        type="button"
        size="icon"
        variant={editor.isActive('bulletList') ? 'default' : 'transparent'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </Button>

      <Button
        type="button"
        size="icon"
        variant={editor.isActive('orderedList') ? 'default' : 'transparent'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </Button>
    </BubbleMenu>
  )
}
