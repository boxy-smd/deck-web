'use client'

import type { Editor } from '@tiptap/react'
import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Button } from './button'

const headings = [
  {
    value: 'h1',
    label: 'Título 1',
  },
  {
    value: 'h2',
    label: 'Título 2',
  },
  {
    value: 'h3',
    label: 'Título 3',
  },
  {
    value: 'paragraph',
    label: 'Parágrafo',
  },
]

interface MenuBarComboboxProps {
  editor: Editor
}

export function MenuBarCombobox({ editor }: MenuBarComboboxProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const handleSelect = (framework: { value: string; label: string }) => {
    setValue(framework.value)
    setOpen(false)

    switch (framework.value) {
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run()
        break
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run()
        break
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run()
        break
      case 'paragraph':
        editor.chain().focus().setParagraph().run()
        break
      default:
        break
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="flex items-center justify-center gap-2 bg-transparent font-medium text-slate-900 text-sm"
        asChild
      >
        <Button variant="transparent" role="combobox" aria-expanded={open}>
          {value
            ? headings.find(headings => headings.value === value)?.label
            : 'Parágrafo'}
          <ChevronDown className="size-[18px] text-slate-900 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <Command>
          <CommandList>
            <CommandGroup>
              {headings.map(headings => (
                <CommandItem
                  key={headings.value}
                  className="font-medium text-slate-900 text-sm"
                >
                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                  <button
                    onClick={() => handleSelect(headings)}
                    className={`flex flex-row ${cn(
                      editor.isActive('heading', {
                        level: Number.parseInt(
                          headings.value.replace('h', ''),
                          10,
                        ),
                      }) || editor.isActive('paragraph')
                        ? 'is-active'
                        : '',
                    )}`}
                  >
                    {headings.label}
                    {editor.isActive('heading', {
                      level: Number.parseInt(
                        headings.value.replace('h', ''),
                        10,
                      ),
                    }) && <Check className="ml-2 h-4 w-4" />}
                  </button>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
