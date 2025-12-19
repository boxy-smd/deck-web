import { zodResolver } from '@hookform/resolvers/zod'
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
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button } from './button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog'
import { Input } from './input'
import { MenuBarCombobox } from './menubar-combobox'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'

interface MenuBarProps {
  editor: Editor
}

const menuBarSchema = z.object({
  url: z.string().min(1).url(),
})

type MenuBarSchema = z.infer<typeof menuBarSchema>

export function MenuBar({ editor }: MenuBarProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MenuBarSchema>({
    resolver: zodResolver(menuBarSchema),
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  function addYouTubeVideo(data: MenuBarSchema) {
    editor.commands.setYoutubeVideo({
      src: data.url,
      width: 640,
      height: 480,
    })

    editor.commands.enter()
    editor.chain().focus().run()

    setIsDialogOpen(false)
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
    }
  }

  return (
    <div className="control-group flex h-10 w-full items-center justify-between rounded-md border border-deck-border bg-deck-bg p-1">
      <ToggleGroup
        onValueChange={toggleEditor}
        className="flex h-full w-full items-center justify-between"
        type="single"
      >
        <div className="flex h-full items-center justify-center gap-1">
          <MenuBarCombobox editor={editor} />

          <div className="block h-full w-px border border-slate-200" />

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

          <div className="block h-full w-px border border-slate-200" />

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

          <Dialog open={isDialogOpen}>
            <DialogTrigger asChild>
              <ToggleGroupItem
                onClick={() => setIsDialogOpen(true)}
                value="youtube"
                variant="transparent"
                size="icon"
              >
                <YoutubeIcon className="size-4" />
              </ToggleGroupItem>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar URL de Vídeo</DialogTitle>

                <DialogDescription>
                  Insira a URL de um vídeo para integrá-la ao seu projeto.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit(addYouTubeVideo)}>
                <div>
                  <Input
                    {...register('url')}
                    className={cn(
                      'mb-5 text-xs',
                      errors.url && 'border-red-800',
                    )}
                    placeholder="URL"
                  />
                </div>

                <DialogFooter>
                  <Button
                    onClick={() => setIsDialogOpen(false)}
                    type="button"
                    size="sm"
                  >
                    Cancelar
                  </Button>

                  <Button type="submit" variant="dark" size="sm">
                    Continuar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </ToggleGroup>
    </div>
  )
}
