import { zodResolver } from '@hookform/resolvers/zod'
import type { Editor } from '@tiptap/react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CodeXml,
  Eraser,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  UploadCloud,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  Unlink,
  YoutubeIcon,
} from 'lucide-react'
import type { AxiosProgressEvent } from 'axios'
import { type ComponentProps, type ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ActionTooltip } from '@/components/publish/editor/action-tooltip'
import { getStoredImagePreferences } from '@/components/publish/editor/image-preferences'
import { projectsControllerUploadRichTextImage } from '@/http/api'
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

interface MenuBarProps {
  editor: Editor
  mobile?: boolean
}

const menuBarSchema = z.object({
  url: z.string().min(1).url(),
})

type MenuBarSchema = z.infer<typeof menuBarSchema>
const imageUrlSchema = z.object({
  url: z.string().min(1).url(),
})
type ImageUrlSchema = z.infer<typeof imageUrlSchema>

interface ToolbarActionProps extends ComponentProps<typeof Button> {
  label: string
  children: ReactNode
}

function ToolbarAction({
  label,
  children,
  className,
  ...props
}: ToolbarActionProps) {
  return (
    <ActionTooltip label={label}>
      <Button
        aria-label={label}
        className={cn('h-7 w-7 rounded-md', className)}
        {...props}
      >
        {children}
      </Button>
    </ActionTooltip>
  )
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: toolbar aggregates many independent controls
export function MenuBar({ editor, mobile = false }: MenuBarProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MenuBarSchema>({
    resolver: zodResolver(menuBarSchema),
  })
  const {
    register: registerImageUrl,
    handleSubmit: handleSubmitImageUrl,
    formState: { errors: imageUrlErrors },
    reset: resetImageUrlForm,
  } = useForm<ImageUrlSchema>({
    resolver: zodResolver(imageUrlSchema),
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [selectedImageFileName, setSelectedImageFileName] = useState('')
  const [isUploadingRichTextImage, setIsUploadingRichTextImage] = useState(false)
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(
    null,
  )

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

  function setLink() {
    const currentHref = editor.getAttributes('link').href || ''
    const input = window.prompt('Insira a URL do link', currentHref)

    if (input === null) {
      return
    }

    const href = input.trim()

    if (!href) {
      editor.chain().focus().unsetLink().run()
      return
    }

    editor.chain().focus().setLink({ href }).run()
  }

  function addImageFromUrl(data: ImageUrlSchema) {
    const preferences = getStoredImagePreferences()
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'image',
        attrs: {
          src: data.url,
          width: preferences.width,
          align: preferences.align,
        },
      })
      .run()
    editor.commands.enter()
    setImageUploadError(null)
    resetImageUrlForm()
    setIsImageDialogOpen(false)
  }

  async function uploadImageFile(file: File) {
    setImageUploadError(null)
    setSelectedImageFileName(file.name)
    setImageUploadProgress(0)
    setIsUploadingRichTextImage(true)

    try {
      const response = await projectsControllerUploadRichTextImage(
        { file },
        {
          onUploadProgress: (event: AxiosProgressEvent) => {
            if (!event.total) {
              return
            }

            const progress = Math.round((event.loaded / event.total) * 100)
            setImageUploadProgress(progress)
          },
        },
      )

      if (!response.url) {
        throw new Error('URL da imagem nao retornada pela API.')
      }

      const preferences = getStoredImagePreferences()
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'image',
          attrs: {
            src: response.url,
            width: preferences.width,
            align: preferences.align,
          },
        })
        .run()
      editor.commands.enter()
      setSelectedImageFileName('')
      setImageUploadProgress(null)
      setIsImageDialogOpen(false)
    } catch {
      setImageUploadError('Nao foi possivel enviar a imagem. Tente novamente.')
      setImageUploadProgress(null)
    } finally {
      setIsUploadingRichTextImage(false)
    }
  }

  const buttonSize = mobile ? 'h-10 w-10 rounded-lg' : 'h-7 w-7 rounded-md'
  const iconSize = mobile ? 'size-5' : 'size-4'
  const toolbarActionClass = cn(buttonSize, mobile && 'shrink-0')
  const toolbarContainerClass = mobile
    ? 'flex h-14 w-full items-center gap-1 overflow-x-auto p-2'
    : 'flex h-10 w-full items-center gap-1 overflow-x-auto p-1'

  return (
    <div className="control-group w-full rounded-md border border-deck-border bg-deck-bg">
      <div className={toolbarContainerClass}>
        <div className="flex h-full shrink-0 items-center justify-center gap-1">
          <ToolbarAction
            type="button"
            size="icon"
            variant="transparent"
            label="Desfazer"
            className={toolbarActionClass}
            disabled={!editor.can().chain().focus().undo().run()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 className={iconSize} />
          </ToolbarAction>

          <ToolbarAction
            type="button"
            size="icon"
            variant="transparent"
            label="Refazer"
            className={toolbarActionClass}
            disabled={!editor.can().chain().focus().redo().run()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 className={iconSize} />
          </ToolbarAction>

          {!mobile && <div className="block h-full w-px border border-slate-200" />}

          {!mobile && <MenuBarCombobox editor={editor} />}

          {!mobile && <div className="block h-full w-px border border-slate-200" />}

          <div className={cn('flex shrink-0 flex-row border-slate-200', mobile ? 'gap-1' : 'gap-2')}>
            <ToolbarAction
              type="button"
              size="icon"
              variant={editor.isActive('bold') ? 'default' : 'transparent'}
              label="Negrito"
              className={toolbarActionClass}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className={iconSize} />
            </ToolbarAction>

            <ToolbarAction
              type="button"
              size="icon"
              variant={editor.isActive('italic') ? 'default' : 'transparent'}
              label="Itálico"
              className={toolbarActionClass}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className={iconSize} />
            </ToolbarAction>

            {!mobile && (
              <ToolbarAction
                type="button"
                size="icon"
                variant={editor.isActive('underline') ? 'default' : 'transparent'}
                label="Sublinhado"
                className={toolbarActionClass}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              >
                <Underline className={iconSize} />
              </ToolbarAction>
            )}

            <ToolbarAction
              type="button"
              size="icon"
              variant={editor.isActive('strike') ? 'default' : 'transparent'}
              label="Riscado"
              className={toolbarActionClass}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough className={iconSize} />
            </ToolbarAction>

            {!mobile && (
              <ToolbarAction
                type="button"
                size="icon"
                variant="transparent"
                label="Limpar formatação"
                className={toolbarActionClass}
                onClick={() =>
                  editor.chain().focus().unsetAllMarks().clearNodes().run()
                }
              >
                <Eraser className={iconSize} />
              </ToolbarAction>
            )}
          </div>

          <div className="block h-full w-px border border-slate-200" />

          <div className={cn('flex shrink-0 flex-row border-slate-200', mobile ? 'gap-1' : 'gap-2')}>
            <ToolbarAction
              type="button"
              size="icon"
              variant={editor.isActive('bulletList') ? 'default' : 'transparent'}
              label="Lista com marcadores"
              className={toolbarActionClass}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className={iconSize} />
            </ToolbarAction>

            <ToolbarAction
              type="button"
              size="icon"
              variant={
                editor.isActive('orderedList') ? 'default' : 'transparent'
              }
              label="Lista numerada"
              className={toolbarActionClass}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className={iconSize} />
            </ToolbarAction>

            {!mobile && (
              <ToolbarAction
                type="button"
                size="icon"
                variant="transparent"
                label="Alinhar à esquerda"
                className={toolbarActionClass}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
              >
                <AlignLeft
                  className={cn(
                    iconSize,
                    editor.isActive({ textAlign: 'left' }) && 'text-deck-darkest',
                  )}
                />
              </ToolbarAction>
            )}

            {!mobile && (
              <ToolbarAction
                type="button"
                size="icon"
                variant="transparent"
                label="Centralizar"
                className={toolbarActionClass}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
              >
                <AlignCenter
                  className={cn(
                    iconSize,
                    editor.isActive({ textAlign: 'center' }) &&
                      'text-deck-darkest',
                  )}
                />
              </ToolbarAction>
            )}

            {!mobile && (
              <ToolbarAction
                type="button"
                size="icon"
                variant="transparent"
                label="Alinhar à direita"
                className={toolbarActionClass}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
              >
                <AlignRight
                  className={cn(
                    iconSize,
                    editor.isActive({ textAlign: 'right' }) &&
                      'text-deck-darkest',
                  )}
                />
              </ToolbarAction>
            )}
          </div>

          <div className="block h-full w-px border border-slate-200" />

          <div className={cn('flex shrink-0 flex-row border-slate-200', mobile ? 'gap-1' : 'gap-2')}>
            <ToolbarAction
              type="button"
              size="icon"
              variant={editor.isActive('link') ? 'default' : 'transparent'}
              label="Inserir/editar link"
              className={toolbarActionClass}
              onClick={setLink}
            >
              <Link2 className={iconSize} />
            </ToolbarAction>

            {!mobile && (
              <ToolbarAction
                type="button"
                size="icon"
                variant="transparent"
                label="Remover link"
                className={toolbarActionClass}
                onClick={() => editor.chain().focus().unsetLink().run()}
              >
                <Unlink className={iconSize} />
              </ToolbarAction>
            )}

            {!mobile && (
              <ToolbarAction
                type="button"
                size="icon"
                variant="transparent"
                label="Inserir divisor"
                className={toolbarActionClass}
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                <Minus className={iconSize} />
              </ToolbarAction>
            )}

            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
              <DialogTrigger asChild>
                <ToolbarAction
                  type="button"
                  size="icon"
                  onClick={() => setIsImageDialogOpen(true)}
                  variant="transparent"
                  label="Inserir imagem"
                  className={toolbarActionClass}
                >
                  <ImagePlus className={iconSize} />
                </ToolbarAction>
              </DialogTrigger>

              <DialogContent className="w-[calc(100vw-1rem)] max-w-lg p-5 sm:w-full sm:p-6">
                <DialogHeader>
                  <DialogTitle>Adicionar imagem</DialogTitle>
                  <DialogDescription>
                    Insira por URL ou faça upload de uma imagem.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmitImageUrl(addImageFromUrl)}>
                  <Input
                    {...registerImageUrl('url')}
                    className={cn(
                      'mb-3 text-xs',
                      imageUrlErrors.url && 'border-red-800',
                    )}
                    placeholder="URL da imagem"
                  />

                  <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
                    <Button
                      onClick={() => setIsImageDialogOpen(false)}
                      type="button"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="dark"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      Inserir URL
                    </Button>
                  </DialogFooter>
                </form>

                <div className="mt-2 border-slate-200 border-t pt-4">
                  <label
                    htmlFor="rich-text-image-upload"
                    className={cn(
                      'flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-deck-border border-dashed bg-slate-50 px-4 py-5 text-center transition-all',
                      isUploadingRichTextImage
                        ? 'cursor-wait opacity-70'
                        : 'hover:border-deck-darkest/40 hover:bg-slate-100',
                    )}
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-deck-secondary-text">
                      <UploadCloud className="size-5" />
                    </span>
                    <p className="font-medium text-deck-darkest text-sm">
                      {isUploadingRichTextImage
                        ? `Enviando imagem... ${imageUploadProgress ?? 0}%`
                        : 'Clique para escolher uma imagem'}
                    </p>
                    <p className="text-deck-secondary-text text-xs">
                      PNG, JPG ou WEBP ate 5MB
                    </p>
                    {selectedImageFileName && (
                      <p className="max-w-full truncate text-deck-secondary-text text-xs">
                        Arquivo: {selectedImageFileName}
                      </p>
                    )}
                  </label>

                  <Input
                    id="rich-text-image-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    className="hidden"
                    disabled={isUploadingRichTextImage}
                    onChange={event => {
                      const file = event.target.files?.[0]
                      if (file) {
                        uploadImageFile(file).catch(() => undefined)
                      }
                      event.currentTarget.value = ''
                    }}
                  />

                  {isUploadingRichTextImage && (
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded bg-slate-200">
                      <div
                        className="h-full bg-deck-darkest transition-all duration-150"
                        style={{ width: `${imageUploadProgress ?? 0}%` }}
                      />
                    </div>
                  )}
                </div>

                {imageUploadError && (
                  <p className="text-red-700 text-sm">{imageUploadError}</p>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="block h-full w-px border border-slate-200" />

        <div className="flex h-full shrink-0 items-center justify-center gap-1">
          {!mobile && (
            <ToolbarAction
              type="button"
              size="icon"
              variant={editor.isActive('codeBlock') ? 'default' : 'transparent'}
              label="Bloco de código"
              className={toolbarActionClass}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <CodeXml className={iconSize} />
            </ToolbarAction>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <ToolbarAction
                type="button"
                size="icon"
                onClick={() => setIsDialogOpen(true)}
                variant="transparent"
                label="Inserir vídeo do YouTube"
                className={toolbarActionClass}
              >
                <YoutubeIcon className={iconSize} />
              </ToolbarAction>
            </DialogTrigger>

            <DialogContent className="w-[calc(100vw-1rem)] max-w-lg p-5 sm:w-full sm:p-6">
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

                <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
                  <Button
                    onClick={() => setIsDialogOpen(false)}
                    type="button"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    variant="dark"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Continuar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
