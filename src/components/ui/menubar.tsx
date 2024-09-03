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
        <div className="flex flex-row">
          <MenuBarCombobox editor={editor} />
          <ToggleGroup type="single">
            <div className="border-slate-200 border-r ">
              <ToggleGroupItem value="a">
                {' '}
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive('bold') ? 'is-active' : ''}
                >
                  <Bold />
                </button>
              </ToggleGroupItem>
              <ToggleGroupItem value="b">
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive('italic') ? 'is-active' : ''}
                >
                  <Italic />
                </button>
              </ToggleGroupItem>
              <ToggleGroupItem value="c">
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={editor.isActive('strike') ? 'is-active' : ''}
                >
                  <Strikethrough />
                </button>
              </ToggleGroupItem>
            </div>

            <ToggleGroupItem value="d">
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedlist') ? 'is-active' : ''}
              >
                <ListOrdered />
              </button>
            </ToggleGroupItem>
            <ToggleGroupItem value="e">
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletlist') ? 'is-active' : ''}
              >
                <List />
              </button>
            </ToggleGroupItem>
            <ToggleGroupItem value="f">
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button onClick={() => editor.commands.toggleCodeBlock()}>
                <Code />
              </button>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <LinkButton editor={editor} />
      </div>
    </div>
  )
}
