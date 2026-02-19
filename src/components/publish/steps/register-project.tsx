'use client'

import { AlertCircle, Check, ChevronsUpDown, Minus, Plus, X } from 'lucide-react'
import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useFormContext } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { InlineErrorNotice } from '@/components/ui/inline-error-notice'
import type { Professor } from '@/entities/professor'
import type { Subject } from '@/entities/subject'
import type { Trail } from '@/entities/trail'
import type { CreateProjectFormSchema } from '@/hooks/project/use-publish-project'
import { getMultiTrailConfig, getTrailConfig } from '@/lib/trails-config'
import { cn } from '@/lib/utils'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import { Skeleton } from '../../ui/skeleton'

export interface ProjectPageProps {
  onNextStep(): void
  professors: Professor[] | undefined
  subjects: Subject[] | undefined
  trails: Trail[] | undefined
  draftData?: Partial<CreateProjectFormSchema>
  onSaveDraft(): void
  isSavingDraft: boolean
  isAdvancing: boolean
  requestError?: string | null
  onDismissRequestError?(): void
}

const CROP_OUTPUT_WIDTH = 1720
const CROP_OUTPUT_HEIGHT = 600
const CROP_MIN_ZOOM = 1
const CROP_MAX_ZOOM = 3

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Falha ao carregar imagem para recorte'))
    img.src = src
  })
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This component is complex by nature
export function RegisterProjectStep({
  onNextStep,
  professors,
  subjects,
  trails,
  onSaveDraft,
  isSavingDraft,
  isAdvancing,
  requestError,
  onDismissRequestError,
  draftData,
}: ProjectPageProps) {
  const {
    formState: { errors },
    getValues,
    register,
    setValue,
    trigger,
    watch,
  } = useFormContext<CreateProjectFormSchema>()

  const [bannerUrl, setBannerUrl] = useState<string | null>(
    draftData?.bannerUrl ||
      (getValues('banner') &&
        URL.createObjectURL(getValues('banner') as File)) ||
      null,
  )
  const watchedBannerUrl = watch('bannerUrl')
  const [localBannerObjectUrl, setLocalBannerObjectUrl] = useState<string | null>(
    null,
  )
  const [cropperOpen, setCropperOpen] = useState(false)
  const [cropperSourceUrl, setCropperSourceUrl] = useState<string | null>(null)
  const [cropperFileName, setCropperFileName] = useState('banner.png')
  const [cropZoom, setCropZoom] = useState(CROP_MIN_ZOOM)
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 })
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const selectedTrails = watch('trailsIds') || []
  const selectedProfessors = watch('professorsIds') || []
  const selectedSubjectId = watch('subjectId') || ''
  const [subjectOpen, setSubjectOpen] = useState(false)
  const sortedSubjects = [...(subjects || [])].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }),
  )
  const selectedSubjectName =
    sortedSubjects.find(subject => subject.id === selectedSubjectId)?.name || ''

  const selectedTrailsNames = selectedTrails.map(
    trailId => trails?.find(trail => trail.id === trailId)?.name ?? '',
  )

  // Obtém a configuração da trilha (SMD se múltiplas, ou a trilha selecionada)
  const multiTrailConfig = getMultiTrailConfig()
  const singleTrailConfig = selectedTrailsNames[0]
    ? getTrailConfig(selectedTrailsNames[0])
    : null

  const trailTheme =
    selectedTrails.length > 0
      ? selectedTrails.length > 1
        ? [
            multiTrailConfig.textColor,
            multiTrailConfig.bgColor,
            multiTrailConfig.color,
          ]
        : singleTrailConfig
          ? [
              singleTrailConfig.textColor,
              singleTrailConfig.bgColor,
              singleTrailConfig.color,
            ]
          : [cn('text-deck-secondary-text'), cn('bg-deck-bg-button'), '#70677B']
      : [cn('text-deck-secondary-text'), cn('bg-deck-bg-button'), '#70677B']

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files?.[0]) {
      return
    }

    const file = event.target.files[0]
    const objectUrl = URL.createObjectURL(file)
    event.target.value = ''

    setCropperFileName(file.name || 'banner.png')
    setCropperSourceUrl(current => {
      if (current) {
        URL.revokeObjectURL(current)
      }

      return objectUrl
    })
    setCropZoom(CROP_MIN_ZOOM)
    setCropPosition({ x: 0, y: 0 })
    setCroppedAreaPixels(null)
    setCropperOpen(true)
  }

  function handleCropZoomChange(value: number) {
    const normalizedValue = Math.min(CROP_MAX_ZOOM, Math.max(CROP_MIN_ZOOM, value))
    setCropZoom(normalizedValue)
  }

  const handleCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  function handleCropAreaKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moveBy = event.shiftKey ? 24 : 8
    let nextPosition = cropPosition

    if (event.key === 'ArrowLeft') {
      nextPosition = { x: cropPosition.x - moveBy, y: cropPosition.y }
    } else if (event.key === 'ArrowRight') {
      nextPosition = { x: cropPosition.x + moveBy, y: cropPosition.y }
    } else if (event.key === 'ArrowUp') {
      nextPosition = { x: cropPosition.x, y: cropPosition.y - moveBy }
    } else if (event.key === 'ArrowDown') {
      nextPosition = { x: cropPosition.x, y: cropPosition.y + moveBy }
    } else {
      return
    }

    event.preventDefault()
    setCropPosition(nextPosition)
  }

  function closeCropper() {
    setCropperOpen(false)
    setCropZoom(CROP_MIN_ZOOM)
    setCropPosition({ x: 0, y: 0 })
    setCroppedAreaPixels(null)
    setCropperSourceUrl(current => {
      if (current) {
        URL.revokeObjectURL(current)
      }

      return null
    })
  }

  async function applyBannerCrop() {
    if (!(cropperSourceUrl && croppedAreaPixels)) {
      return
    }

    const image = await loadImage(cropperSourceUrl)
    const canvas = document.createElement('canvas')
    canvas.width = CROP_OUTPUT_WIDTH
    canvas.height = CROP_OUTPUT_HEIGHT

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    const sourceX = Math.max(0, Math.round(croppedAreaPixels.x))
    const sourceY = Math.max(0, Math.round(croppedAreaPixels.y))
    const sourceWidth = Math.min(
      image.naturalWidth - sourceX,
      Math.round(croppedAreaPixels.width),
    )
    const sourceHeight = Math.min(
      image.naturalHeight - sourceY,
      Math.round(croppedAreaPixels.height),
    )

    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    )

    const blob = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', 0.92)
    })

    if (!blob) {
      return
    }

    const fileNameBase = cropperFileName.replace(/\.[^.]+$/, '') || 'banner'
    const croppedFile = new File([blob], `${fileNameBase}-crop.jpg`, {
      type: 'image/jpeg',
    })

    const objectUrl = URL.createObjectURL(croppedFile)

    setValue('banner', croppedFile, {
      shouldDirty: true,
      shouldTouch: true,
    })
    setBannerUrl(objectUrl)
    setLocalBannerObjectUrl(current => {
      if (current) {
        URL.revokeObjectURL(current)
      }

      return objectUrl
    })

    closeCropper()
  }

  const [hasSecondProfessor, setHasSecondProfessor] = useState(
    selectedProfessors.length > 1,
  )

  useEffect(() => {
    setHasSecondProfessor(selectedProfessors.length > 1)
  }, [selectedProfessors.length])

  useEffect(() => {
    if (watchedBannerUrl) {
      setBannerUrl(watchedBannerUrl)
      return
    }

    if (draftData?.bannerUrl) {
      setBannerUrl(draftData.bannerUrl)
    }
  }, [draftData?.bannerUrl, watchedBannerUrl])

  useEffect(() => {
    return () => {
      if (localBannerObjectUrl) {
        URL.revokeObjectURL(localBannerObjectUrl)
      }
    }
  }, [localBannerObjectUrl])

  function toggleProfessorField() {
    const currentProfessors = getValues('professorsIds') || []

    if (currentProfessors.length === 1) {
      setHasSecondProfessor(true)
    }

    if (hasSecondProfessor) {
      setHasSecondProfessor(false)
      setValue('professorsIds', [currentProfessors[0]])
    }
  }

  async function validateStep() {
    const isValid = await trigger([
      'title',
      'trailsIds',
      'semester',
      'publishedYear',
      'description',
    ])

    return !isValid
  }

  async function handleNextStep() {
    const hasError = await validateStep()

    if (hasError) {
      return
    }

    onNextStep()
  }

  function handleSaveDraft() {
    const hasTitle = getValues('title')

    if (!hasTitle) {
      trigger('title').catch(() => undefined)
      return
    }

    onSaveDraft()
  }

  return (
    <main className="flex w-full max-w-[860px] flex-col items-center justify-center gap-6 px-2 pb-6 lg:px-0 lg:pb-0">
      <div className="relative h-[220px] w-full overflow-hidden rounded-md lg:h-[300px] lg:rounded-none">
        <div
          className="flex h-[220px] w-full bg-slate-200 lg:h-[300px]"
          style={{
            backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <Button
          asChild
          className="absolute right-4 bottom-4 cursor-pointer bg-deck-bg"
          size="sm"
        >
          <Label htmlFor="banner" className="text-deck-darkest">
            Editar Capa
          </Label>
        </Button>
      </div>

      <input
        onChange={handleImageChange}
        className="invisible size-0"
        id="banner"
        accept="image/*"
        draggable
        multiple={false}
        type="file"
      />

      <Dialog open={cropperOpen} onOpenChange={open => !open && closeCropper()}>
        <DialogContent className="max-h-[90vh] w-[calc(100vw-1rem)] max-w-3xl gap-4 overflow-y-auto p-4 sm:w-full sm:p-6">
          <DialogHeader>
            <DialogTitle>Recortar banner</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Arraste para reposicionar e use o zoom para ajustar a imagem antes
              do upload.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div
              className="relative h-[40vw] max-h-[260px] min-h-[170px] w-full overflow-hidden rounded-md border border-deck-border bg-slate-200 sm:aspect-[43/15] sm:h-auto"
              role="application"
              aria-label="Área de recorte do banner. Arraste para mover e use as setas do teclado para ajuste fino."
              onKeyDown={handleCropAreaKeyDown}
            >
              {cropperSourceUrl && (
                <Cropper
                  image={cropperSourceUrl}
                  crop={cropPosition}
                  zoom={cropZoom}
                  aspect={CROP_OUTPUT_WIDTH / CROP_OUTPUT_HEIGHT}
                  minZoom={CROP_MIN_ZOOM}
                  maxZoom={CROP_MAX_ZOOM}
                  objectFit="horizontal-cover"
                  restrictPosition
                  showGrid
                  zoomWithScroll
                  style={{
                    containerStyle: {
                      background:
                        'linear-gradient(180deg, rgba(230,233,242,0.85) 0%, rgba(219,224,236,0.85) 100%)',
                    },
                    cropAreaStyle: {
                      border: '2px solid rgba(20, 22, 28, 0.35)',
                      boxShadow: '0 0 0 9999em rgba(11, 15, 25, 0.35)',
                    },
                    mediaStyle: {
                      filter: 'saturate(1.02) contrast(1.01)',
                    },
                  }}
                  onCropChange={setCropPosition}
                  onZoomChange={setCropZoom}
                  onCropComplete={handleCropComplete}
                />
              )}
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <Label htmlFor="banner-zoom" className="shrink-0 text-deck-secondary-text text-xs">
                Zoom
              </Label>

              <Button
                type="button"
                variant="default"
                size="icon"
                onClick={() => handleCropZoomChange(cropZoom - 0.1)}
                className="size-8 shrink-0 rounded-md"
                aria-label="Diminuir zoom"
              >
                <Minus className="size-4" />
              </Button>

              <input
                id="banner-zoom"
                type="range"
                min={CROP_MIN_ZOOM}
                max={CROP_MAX_ZOOM}
                step={0.01}
                value={cropZoom}
                onChange={event => handleCropZoomChange(Number(event.target.value))}
                className="h-2 w-full min-w-0 cursor-pointer accent-deck-darkest"
              />

              <Button
                type="button"
                variant="default"
                size="icon"
                onClick={() => handleCropZoomChange(cropZoom + 0.1)}
                className="size-8 shrink-0 rounded-md"
                aria-label="Aumentar zoom"
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <p className="text-deck-secondary-text text-xs">
              Dica: use as setas para mover a imagem (Shift + seta para mover mais
              rápido).
            </p>
          </div>

          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
            <Button
              type="button"
              variant="default"
              onClick={closeCropper}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="dark"
              onClick={applyBannerCrop}
              disabled={!croppedAreaPixels}
              className="w-full sm:w-auto"
            >
              Aplicar recorte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex w-full flex-col items-start gap-2">
        <Label
          htmlFor="title"
          className={`flex items-center gap-2.5 text-xs ${errors.title ? 'text-red-800' : 'text-deck-secondary-text'}`}
        >
          TÍTULO (MAX. 29 CARACTERES) *
          {errors.title && <AlertCircle className="size-4 text-red-800" />}
        </Label>

        <input
          className={`w-full border-b-2 bg-transparent pb-1 font-semibold text-3xl placeholder-deck-darkest focus:outline-hidden ${
            errors.title ? 'border-red-800' : 'border-slate-700'
          }`}
          type="text"
          placeholder="Digite um Título"
          {...register('title')}
        />
        {errors.title?.message && (
          <p className="text-red-800 text-xs">{errors.title.message}</p>
        )}
      </div>

      <div className="w-full">
        <Label
          htmlFor="trailsIds"
          className={`flex items-center gap-2.5 text-xs ${
            errors.trailsIds ? 'text-red-800' : 'text-deck-secondary-text'
          }`}
        >
          TRILHAS *{' '}
          {errors.trailsIds && <AlertCircle className="size-4 text-red-800" />}
        </Label>

        <div className="mt-2 flex items-start gap-4 overflow-x-auto pb-1">
          {trails ? (
            <ToggleGroup
              value={selectedTrails}
              onValueChange={value => {
                setValue('trailsIds', value)
                trigger('trailsIds')
              }}
              className="flex min-w-max gap-4"
              type="multiple"
            >
              {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Isso é seguro */}
              {trails?.map(option => {
                const trailConfig = getTrailConfig(option.name, option)
                const { icon: Icon, color, textColor, bgColor } = trailConfig

                return (
                  <ToggleGroupItem
                    key={option.id}
                    value={option.id}
                    className={cn(
                      'rounded-[18px] border-2 border-deck-border bg-deck-clear-tone',
                      selectedTrails?.includes(option.id)
                        ? selectedTrails.length > 1
                          ? trailTheme[1]
                          : bgColor
                        : '#F1F3F9',
                    )}
                    variant={
                      selectedTrails?.includes(option.id) ? 'addedTo' : 'toAdd'
                    }
                    size="tag"
                  >
                    <div className="flex flex-row items-center gap-2">
                      <Icon
                        innerColor={
                          selectedTrails?.includes(option.id)
                            ? selectedTrails.length > 1
                              ? trailTheme[2]
                              : color
                            : '#70677B'
                        }
                        foregroundColor="transparent"
                        className="size-6"
                      />

                      <p
                        className={cn(
                          'text-sm',
                          selectedTrails?.includes(option.id)
                            ? selectedTrails.length > 1
                              ? trailTheme[0]
                              : textColor
                            : 'text-deck-placeholder',
                        )}
                      >
                        {option.name}
                      </p>

                      {selectedTrails?.includes(option.id) ? (
                        <X
                          className={cn(
                            'size-[18px]',
                            selectedTrails?.includes(option.id)
                              ? selectedTrails.length > 1
                                ? trailTheme[0]
                                : textColor
                              : 'text-deck-placeholder',
                          )}
                        />
                      ) : (
                        <Plus className="size-[18px]" />
                      )}
                    </div>
                  </ToggleGroupItem>
                )
              })}
            </ToggleGroup>
          ) : (
            <>
              <Skeleton className="h-8 w-[120px] rounded-[18px]" />
              <Skeleton className="h-8 w-[120px] rounded-[18px]" />
              <Skeleton className="h-8 w-[120px] rounded-[18px]" />
              <Skeleton className="h-8 w-[120px] rounded-[18px]" />
            </>
          )}
        </div>
        {errors.trailsIds?.message && (
          <p className="mt-1 text-red-800 text-xs">{errors.trailsIds.message}</p>
        )}
      </div>

      <div className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:flex lg:flex-row">
        <div className="flex w-full flex-col gap-2 lg:w-[165px]">
          <Label htmlFor="subject" className="text-deck-secondary-text text-xs">
            DISCIPLINA
          </Label>

          <Popover open={subjectOpen} onOpenChange={setSubjectOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="transparent"
                role="combobox"
                aria-expanded={subjectOpen}
                className={cn(
                  'w-full justify-between gap-2 rounded-[18px] px-3 py-2 text-left font-medium text-sm lg:w-[165px]',
                  trailTheme[0],
                  trailTheme[1],
                )}
              >
                <span className="min-w-0 flex-1 truncate">
                  {selectedSubjectName || 'Insira a disciplina'}
                </span>
                <ChevronsUpDown className="size-4 shrink-0 opacity-60" />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className={cn('w-[min(560px,90vw)] border-deck-border p-0', trailTheme[1])}
              align="start"
            >
              <Command className={cn('rounded-md bg-transparent', trailTheme[0])}>
                <CommandInput
                  placeholder="Buscar disciplina..."
                  className="placeholder:text-deck-placeholder"
                />
                <CommandList className="max-h-64">
                  <CommandEmpty>Nenhuma disciplina encontrada.</CommandEmpty>
                  <CommandGroup>
                    {sortedSubjects.map(subject => (
                      <CommandItem
                        key={subject.id}
                        value={`${subject.name} ${subject.id}`}
                        onSelect={() => {
                          setValue('subjectId', subject.id, {
                            shouldDirty: true,
                            shouldTouch: true,
                          })
                          setSubjectOpen(false)
                        }}
                        className="w-full items-start py-2 data-[selected=true]:bg-deck-bg"
                      >
                        <Check
                          className={cn(
                            'mt-0.5 mr-2 size-4 shrink-0',
                            selectedSubjectId === subject.id
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        <span className="line-clamp-2 break-words text-sm">
                          {subject.name}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex w-full flex-col gap-2 lg:w-[164px]">
          <Label
            htmlFor="semester"
            className={`flex items-center gap-2.5 text-xs ${
              errors.semester ? 'text-red-800' : 'text-deck-secondary-text'
            }`}
          >
            SEMESTRE *
            {errors.semester && <AlertCircle className="size-4 text-red-800" />}
          </Label>

          <Select
            value={watch('semester') ? String(watch('semester')) : ''}
            onValueChange={value => setValue('semester', Number(value))}
          >
            <SelectTrigger className={cn(trailTheme[0], trailTheme[1])}>
              <SelectValue placeholder="Insira o semestre" />
            </SelectTrigger>

            <SelectContent className={cn(trailTheme[1])}>
              {Array.from({
                length: 12,
              })
                .map((_, index) => ({
                  value: index + 1,
                  label: `${index + 1}º Semestre`,
                }))
                .map(semester => (
                  <SelectItem
                    key={semester.value}
                    value={String(semester.value)}
                    className="focus:bg-deck-bg"
                  >
                    {semester.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.semester?.message && (
            <p className="text-red-800 text-xs">{errors.semester.message}</p>
          )}
        </div>

        <div className="flex w-full flex-col gap-2 sm:col-span-2 lg:w-[128px]">
          <Label
            htmlFor="publishedYear"
            className={`flex items-center gap-2.5 text-xs ${
              errors.publishedYear ? 'text-red-800' : 'text-deck-secondary-text'
            }`}
          >
            ANO *
            {errors.publishedYear && (
              <AlertCircle className="size-4 text-red-800" />
            )}
          </Label>

          <Select
            value={
              watch('publishedYear') ? String(watch('publishedYear')) : ''
            }
            onValueChange={value => setValue('publishedYear', Number(value))}
          >
            <SelectTrigger className={cn(trailTheme[0], trailTheme[1])}>
              <SelectValue placeholder="Insira o ano" />
            </SelectTrigger>

            <SelectContent className={cn(trailTheme[1])}>
              {Array.from({
                length: new Date().getFullYear() - 2013,
              })
                .map((_, index) => ({
                  value: new Date().getFullYear() - index,
                  label: `${new Date().getFullYear() - index}`,
                }))
                .map(year => (
                  <SelectItem
                    className="focus:bg-deck-bg"
                    key={year.value}
                    value={String(year.value)}
                  >
                    {year.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.publishedYear?.message && (
            <p className="text-red-800 text-xs">{errors.publishedYear.message}</p>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label
          className={`flex items-center gap-2.5 text-xs ${
            errors.description ? 'text-red-800' : 'text-deck-secondary-text'
          }`}
        >
          DESCRIÇÃO *
          {errors.description && (
            <AlertCircle className="size-4 text-red-800" />
          )}
        </Label>

        <Textarea
          className={`h-20 resize-none ${
            errors.description ? 'border-red-800' : 'border-slate-200'
          }`}
          maxLength={300}
          placeholder="Digite a descrição"
          {...register('description')}
        />
        {errors.description?.message && (
          <p className="text-red-800 text-xs">{errors.description.message}</p>
        )}
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label
          htmlFor="professors"
          className="text-deck-secondary-text text-xs"
        >
          PROFESSORES (MÁX. 2)
        </Label>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={selectedProfessors[0] || ''}
            onValueChange={value => {
              const currentProfessors = [...(getValues('professorsIds') || [])]
              currentProfessors[0] = value
              setValue('professorsIds', currentProfessors)
            }}
          >
            <SelectTrigger
              className={cn('w-full sm:w-[220px] lg:w-[140px]', trailTheme[1], trailTheme[0])}
            >
              <SelectValue placeholder="Insira o nome" />
            </SelectTrigger>

            <SelectContent className={trailTheme[1]}>
              {professors?.map(professor => (
                <SelectItem
                  className="focus:bg-deck-bg"
                  key={professor.id}
                  value={professor.id}
                >
                  {professor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasSecondProfessor && (
            <Select
              value={selectedProfessors[1] || ''}
              onValueChange={value => {
                const currentProfessors = [...(getValues('professorsIds') || [])]
                currentProfessors[1] = value
                setValue('professorsIds', currentProfessors)
              }}
            >
              <SelectTrigger
                className={cn('w-full sm:w-[220px] lg:w-[140px]', trailTheme[1], trailTheme[0])}
              >
                <SelectValue placeholder="Insira o nome" />
              </SelectTrigger>

              <SelectContent className={trailTheme[1]}>
                {professors?.map(professor => (
                  <SelectItem
                    className="focus:bg-deck-bg"
                    key={professor.id}
                    value={professor.id}
                  >
                    {professor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            onClick={toggleProfessorField}
            className="rounded-full bg-slate-100 p-2"
            type="button"
          >
            {hasSecondProfessor ? (
              <Minus className="size-4 text-deck-secondary-text" />
            ) : (
              <Plus className="size-4 text-deck-secondary-text" />
            )}
          </Button>
        </div>
      </div>

      <div className="mb-6 flex w-full flex-col-reverse justify-end gap-2 sm:flex-row">
        {requestError && (
          <InlineErrorNotice
            message={requestError}
            onDismiss={onDismissRequestError}
            className="mr-auto"
          />
        )}

        <Button
          onClick={handleSaveDraft}
          type="button"
          size="sm"
          disabled={isSavingDraft}
        >
          {isSavingDraft ? 'Salvando...' : 'Salvar Rascunho'}
        </Button>

        <Button
          onClick={handleNextStep}
          type="button"
          variant="dark"
          size="sm"
          disabled={isAdvancing}
        >
          Avançar
        </Button>
      </div>
    </main>
  )
}
