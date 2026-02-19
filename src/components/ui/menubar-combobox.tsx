'use client'

import type { Editor } from '@tiptap/react'
import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

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
    label: 'Texto Normal',
  },
]

interface MenuBarComboboxProps {
  editor: Editor
}

export function MenuBarCombobox({ editor }: MenuBarComboboxProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('paragraph')

  useEffect(() => {
    const updateValue = () => {
      if (editor.isActive('heading', { level: 1 })) {
        setValue('h1')
        return
      }

      if (editor.isActive('heading', { level: 2 })) {
        setValue('h2')
        return
      }

      if (editor.isActive('heading', { level: 3 })) {
        setValue('h3')
        return
      }

      setValue('paragraph')
    }

    updateValue()
    editor.on('selectionUpdate', updateValue)
    editor.on('update', updateValue)

    return () => {
      editor.off('selectionUpdate', updateValue)
      editor.off('update', updateValue)
    }
  }, [editor])

  function handleSelect(value: string) {
    setValue(value)
    setOpen(false)

    switch (value) {
      case 'h1':
        editor.chain().focus().setHeading({ level: 1 }).run()
        break
      case 'h2':
        editor.chain().focus().setHeading({ level: 2 }).run()
        break
      case 'h3':
        editor.chain().focus().setHeading({ level: 3 }).run()
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
        <Button
          type="button"
          variant="transparent"
          role="combobox"
          aria-expanded={open}
        >
          {headings.find(headings => headings.value === value)?.label}
          <ChevronDown className="size-4.5 text-deck-darkest opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="mt-1">
        <Command>
          <CommandList>
            <CommandGroup
              value={headings.find(headings => headings.value === value)?.label}
              className="bg-deck-bg"
            >
              {headings.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className={cn(
                    option.value === value ? 'bg-deck-clear-hover' : '',
                  )}
                >
                  {option.value === value && (
                    <Check className="absolute left-2 size-4.5" />
                  )}

                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
