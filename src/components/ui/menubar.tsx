import type { Editor } from '@tiptap/react'
import {
  Bold,
  CodeXml,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  YoutubeIcon,
} from 'lucide-react'

import { MenuBarCombobox } from './menubar-combobox'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'

interface MenuBarProps {
  editor: Editor
}

export function MenuBar({ editor }: MenuBarProps) {
  function addYouTubeVideo() {
    const url = prompt('Enter YouTube URL')

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      })
    }
  }

  function toggleEditor(value: string) {
    editor.chain().focus().clearNodes().run()

    switch (value) {
      case 'bold':
        editor.chain().focus().toggleBold().run()
        break
      case 'italic':
        editor.chain().focus().toggleItalic().run()
        break
      case 'strike':
        editor.chain().focus().toggleStrike().run()
        break
      case 'bullet-list':
        editor.chain().focus().toggleBulletList().run()
        break
      case 'ordered-list':
        editor.chain().focus().toggleOrderedList().run()
        break
      case 'code':
        editor.chain().focus().toggleCodeBlock().run()
        break
      case 'youtube':
        addYouTubeVideo()
        break
    }
  }

  return (
    <div className="control-group flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-transparent p-1">
      <ToggleGroup
        onValueChange={toggleEditor}
        className="flex h-full w-full items-center justify-between"
        type="single"
      >
        <div className="flex h-full items-center justify-center gap-1">
          <MenuBarCombobox editor={editor} />

          <div className="block h-full w-[1px] border border-slate-200" />

          <div className="flex flex-row gap-2 border-slate-200">
            <ToggleGroupItem
              value="bold"
              variant={editor.isActive('bold') ? 'active' : 'transparent'}
              size="icon"
            >
              <Bold className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="italic"
              variant={editor.isActive('italic') ? 'active' : 'transparent'}
              size="icon"
            >
              <Italic className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="strike"
              variant={editor.isActive('strike') ? 'active' : 'transparent'}
              size="icon"
            >
              <Strikethrough className="size-4" />
            </ToggleGroupItem>
          </div>

          <div className="block h-full w-[1px] border border-slate-200" />

          <div className="flex flex-row gap-2 border-slate-200">
            <ToggleGroupItem
              value="bullet-list"
              variant={editor.isActive('bulletList') ? 'active' : 'transparent'}
              size="icon"
            >
              <List className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="ordered-list"
              variant={
                editor.isActive('orderedList') ? 'active' : 'transparent'
              }
              size="icon"
            >
              <ListOrdered className="size-4" />
            </ToggleGroupItem>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1">
          <ToggleGroupItem
            value="code"
            variant={editor.isActive('codeBlock') ? 'active' : 'transparent'}
            size="icon"
          >
            <CodeXml className="size-4" />
          </ToggleGroupItem>

          <ToggleGroupItem value="youtube" variant="transparent" size="icon">
            <YoutubeIcon className="size-4" />
          </ToggleGroupItem>
        </div>
      </ToggleGroup>
    </div>
  )
}
