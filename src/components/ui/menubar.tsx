import type { Editor } from '@tiptap/react'
import {
  Bold,
  Code,
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

  return (
    <div className="control-group flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-transparent p-1">
      <ToggleGroup
        type="single"
        className="flex h-full w-full items-center justify-between"
      >
        <div className="flex h-full items-center justify-center gap-1">
          <MenuBarCombobox editor={editor} />

          <div className="block h-full w-[1px] border border-slate-200" />

          <div className="flex flex-row gap-2 border-slate-200">
            <ToggleGroupItem
              value="a"
              onClick={() => editor.chain().focus().toggleBold().run()}
              variant={editor.isActive('bold') ? 'active' : 'default'}
              size="icon"
              className="border-none bg-transparent"
            >
              <Bold className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="b"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              variant={editor.isActive('italic') ? 'active' : 'default'}
              size="icon"
              className="border-none bg-transparent"
            >
              <Italic className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="c"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              variant={editor.isActive('strike') ? 'active' : 'default'}
              size="icon"
              className="border-none bg-transparent"
            >
              <Strikethrough className="size-4" />
            </ToggleGroupItem>
          </div>

          <div className="block h-full w-[1px] border border-slate-200" />

          <div className="flex flex-row gap-2 border-slate-200">
            <ToggleGroupItem
              value="d"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              variant={editor.isActive('orderedlist') ? 'active' : 'default'}
              size="icon"
              className="border-none bg-transparent"
            >
              <ListOrdered className="size-4" />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="e"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              variant={editor.isActive('bulletlist') ? 'active' : 'default'}
              size="icon"
              className="border-none bg-transparent"
            >
              <List className="size-4" />
            </ToggleGroupItem>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1">
          <ToggleGroupItem
            value="f"
            onClick={() => editor.commands.toggleCodeBlock()}
            variant={editor.isActive('codeblock') ? 'active' : 'default'}
            size="icon"
            className="border-none bg-transparent"
          >
            <Code className="size-4" />
          </ToggleGroupItem>

          <ToggleGroupItem
            value="g"
            onClick={addYouTubeVideo}
            size="icon"
            className="border-none bg-transparent"
          >
            <YoutubeIcon className="size-4" />
          </ToggleGroupItem>
        </div>
      </ToggleGroup>
    </div>
  )
}
