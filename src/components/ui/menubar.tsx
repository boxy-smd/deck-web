import type { Editor } from '@tiptap/react'
import {
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from 'lucide-react'

import { LinkButton } from './link-button'
import { MenuBarCombobox } from './menubar-combobox'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'

interface MenuBarProps {
  editor: Editor
}

export function MenuBar({ editor }: MenuBarProps) {
  return (
    <div className="control-group flex h-12 w-full items-center border-lint-100 border-b-2 bg-white">
      <div className="button-group mx-8 flex w-full flex-row items-center justify-between">
        <div className="flex flex-row gap-2">
          <MenuBarCombobox editor={editor} />
          <ToggleGroup type="single">
            <div className='flex flex-row gap-2 border-slate-200 border-r pr-1'>
              <ToggleGroupItem value="a" onClick={() => editor.chain().focus().toggleBold().run()} className={`rounded-md border-none bg-slate-50 py-3 ${editor.isActive('bold') ? 'is-active' : ''}`}>
                <Bold className='size-4' />
              </ToggleGroupItem>
              <ToggleGroupItem value="b" onClick={() => editor.chain().focus().toggleItalic().run()} className={`rounded-md border-none bg-slate-50 py-3 ${editor.isActive('italic') ? 'is-active' : ''}`}>
                <Italic className='size-4' />
              </ToggleGroupItem>
              <ToggleGroupItem value="c" onClick={() => editor.chain().focus().toggleStrike().run()} className={`rounded-md border-none bg-slate-50 py-3 ${editor.isActive('strike') ? 'is-active' : ''}`}>
                <Strikethrough className='size-4' />
              </ToggleGroupItem>
            </div>
            <ToggleGroupItem value="d" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`rounded-md border-none bg-slate-50 py-3 ${editor.isActive('orderedlist') ? 'is-active' : ''}`} >
              <ListOrdered className='size-4' />
            </ToggleGroupItem>
            <ToggleGroupItem value="e" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`rounded-md border-none bg-slate-50 py-3 ${editor.isActive('bulletlist') ? 'is-active' : ''}`}>
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button

                className={editor.isActive('bulletlist') ? 'is-active' : ''}
              >
                <List className='size-4' />
              </button>
            </ToggleGroupItem>
            <ToggleGroupItem value="f" onClick={() => editor.commands.toggleCodeBlock()} className='rounded-md border-none bg-slate-50 py-3 '>
              <Code className='size-4' />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <LinkButton editor={editor} />
      </div>
    </div >
  )
}
