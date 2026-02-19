import { Extension, type Range } from '@tiptap/core'
import type { Editor } from '@tiptap/react'
import Suggestion from '@tiptap/suggestion'
import tippy, { type Instance as TippyInstance } from 'tippy.js'
import 'tippy.js/dist/tippy.css'

type SlashItem = {
  icon: string
  title: string
  description: string
  searchTerms: string[]
  command: (params: { editor: Editor; range: Range }) => void
}

type SuggestionProps = {
  editor: Editor
  items: SlashItem[]
  command: (item: SlashItem) => void
  clientRect?: (() => DOMRect) | null
}

type SuggestionKeyDownProps = {
  event: KeyboardEvent
}

const slashItems: SlashItem[] = [
  {
    icon: '¶',
    title: 'Texto normal',
    description: 'Adicionar parágrafo',
    searchTerms: ['paragrafo', 'texto', 'normal'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run()
    },
  },
  {
    icon: 'H1',
    title: 'Título 1',
    description: 'Adicionar título grande',
    searchTerms: ['h1', 'titulo'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
    },
  },
  {
    icon: 'H2',
    title: 'Título 2',
    description: 'Adicionar subtítulo',
    searchTerms: ['h2', 'subtitulo'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run()
    },
  },
  {
    icon: 'H3',
    title: 'Título 3',
    description: 'Adicionar seção menor',
    searchTerms: ['h3', 'secao'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run()
    },
  },
  {
    icon: '•',
    title: 'Lista com marcadores',
    description: 'Adicionar lista de itens',
    searchTerms: ['lista', 'bullet'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    icon: '1.',
    title: 'Lista numerada',
    description: 'Adicionar lista ordenada',
    searchTerms: ['numerada', 'ordered'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    icon: '☑',
    title: 'Checklist',
    description: 'Inserir lista de tarefas',
    searchTerms: ['checklist', 'task', 'tarefas'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleTaskList()
        .insertContent('Nova tarefa')
        .run()
    },
  },
  {
    icon: '▦',
    title: 'Tabela',
    description: 'Inserir tabela 3x3',
    searchTerms: ['tabela', 'table'],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run()
    },
  },
  {
    icon: '</>',
    title: 'Bloco de código',
    description: 'Adicionar bloco de código',
    searchTerms: ['code', 'codigo'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
  },
  {
    icon: '"',
    title: 'Citação',
    description: 'Adicionar bloco de citação',
    searchTerms: ['quote', 'citacao'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    icon: '─',
    title: 'Linha horizontal',
    description: 'Adicionar separador',
    searchTerms: ['linha', 'separador'],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
]

function createMenuRenderer() {
  let selectedIndex = 0
  let popup: TippyInstance[] = []
  let container: HTMLDivElement | null = null
  let props: SuggestionProps

  function selectItem(index: number) {
    const item = props.items[index]

    if (item) {
      props.command(item)
    }
  }

  function updateMenu() {
    if (!container) {
      return
    }

    container.innerHTML = ''

    if (props.items.length === 0) {
      const empty = document.createElement('div')
      empty.className = 'px-3 py-2 text-deck-secondary-text text-sm'
      empty.textContent = 'Nenhum comando encontrado'
      container.appendChild(empty)
      return
    }

    selectedIndex = Math.min(selectedIndex, props.items.length - 1)
    selectedIndex = Math.max(selectedIndex, 0)

    props.items.forEach((item, index) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className =
        'flex w-full items-center gap-3 rounded-xs px-3 py-2 text-left hover:bg-slate-100'

      if (index === selectedIndex) {
        button.classList.add('bg-slate-100')
      }

      const icon = document.createElement('span')
      icon.className =
        'inline-flex size-9 shrink-0 items-center justify-center rounded-xs bg-slate-100 font-semibold text-[11px] text-deck-secondary-text leading-none'
      icon.textContent = item.icon

      const textContent = document.createElement('div')
      textContent.className = 'flex min-w-0 flex-col items-start justify-center'

      const title = document.createElement('span')
      title.className = 'font-medium text-deck-darkest text-sm'
      title.textContent = item.title

      const description = document.createElement('span')
      description.className = 'text-deck-secondary-text text-xs leading-4'
      description.textContent = item.description

      textContent.appendChild(title)
      textContent.appendChild(description)
      button.appendChild(icon)
      button.appendChild(textContent)
      button.onmousedown = event => {
        event.preventDefault()
        selectItem(index)
      }

      container?.appendChild(button)
    })
  }

  return {
    onStart: (startProps: SuggestionProps) => {
      props = startProps
      selectedIndex = 0

      if (!startProps.clientRect) {
        return
      }

      container = document.createElement('div')
      container.className =
        'min-w-[260px] rounded-md border border-deck-border bg-white p-1 shadow-md'

      updateMenu()

      popup = tippy('body', {
        getReferenceClientRect: startProps.clientRect,
        appendTo: () => document.body,
        content: container,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
        theme: 'slash-menu',
        arrow: false,
      })
    },
    onUpdate: (updatedProps: SuggestionProps) => {
      props = updatedProps
      updateMenu()

      if (!updatedProps.clientRect) {
        return
      }

      popup[0]?.setProps({
        getReferenceClientRect: updatedProps.clientRect,
      })
    },
    onKeyDown: ({ event }: SuggestionKeyDownProps) => {
      if (event.key === 'Escape') {
        popup[0]?.hide()
        return true
      }

      if (props.items.length === 0) {
        return false
      }

      if (event.key === 'ArrowUp') {
        selectedIndex = (selectedIndex + props.items.length - 1) % props.items.length
        updateMenu()
        return true
      }

      if (event.key === 'ArrowDown') {
        selectedIndex = (selectedIndex + 1) % props.items.length
        updateMenu()
        return true
      }

      if (event.key === 'Enter') {
        selectItem(selectedIndex)
        return true
      }

      return false
    },
    onExit: () => {
      popup[0]?.destroy()
      popup = []
      container = null
    },
  }
}

export const SlashCommand = Extension.create({
  name: 'slash-command',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        startOfLine: true,
        items: ({ query }: { query: string }) => {
          const normalizedQuery = query.toLowerCase().trim()

          return slashItems
            .filter(item => {
              if (!normalizedQuery) {
                return true
              }

              return (
                item.title.toLowerCase().includes(normalizedQuery) ||
                item.description.toLowerCase().includes(normalizedQuery) ||
                item.searchTerms.some(term =>
                  term.toLowerCase().includes(normalizedQuery),
                )
              )
            })
            .slice(0, 8)
        },
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor
          range: Range
          props: SlashItem
        }) => {
          props.command({ editor, range })
        },
        render: createMenuRenderer,
      },
    }
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...(this.options.suggestion as Record<string, unknown>),
      }),
    ]
  },
})
