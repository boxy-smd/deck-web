'use client'

import { AlertCircle, Minus, Plus, X } from 'lucide-react'
import { type ChangeEvent, type ElementType, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Professor } from '@/entities/professor'
import type { Subject } from '@/entities/subject'
import type { Trail } from '@/entities/trail'
import type { CreateProjectFormSchema } from '@/hooks/project/use-publish-project'
import { cn } from '@/lib/utils'
import { Audiovisual } from '../../assets/audiovisual'
import { Design } from '../../assets/design'
import { Games } from '../../assets/games'
import { Systems } from '../../assets/systems'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import { Skeleton } from '../../ui/skeleton'

const trailsIcons: Record<string, [ElementType, string, string, string]> = {
  Design: [
    Design,
    '#980C0C',
    cn('text-deck-red-dark'),
    cn('bg-deck-red-light'),
  ],
  Sistemas: [
    Systems,
    '#00426E',
    cn('text-deck-blue-dark'),
    cn('bg-deck-blue-light'),
  ],
  Audiovisual: [
    Audiovisual,
    '#8A3500',
    cn('text-deck-orange-dark'),
    cn('bg-deck-orange-light'),
  ],
  Jogos: [
    Games,
    '#007F05',
    cn('text-deck-green-dark'),
    cn('bg-deck-green-light'),
  ],
  SMD: [
    Design,
    '#7D00B3',
    cn('text-deck-purple-dark'),
    cn('bg-deck-purple-light'),
  ],
}

export interface ProjectPageProps {
  onNextStep(): void
  professors: Professor[] | undefined
  subjects: Subject[] | undefined
  trails: Trail[] | undefined
  draftData?: Partial<CreateProjectFormSchema>
  onSaveDraft(): void
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This component is complex by nature
export function RegisterProjectStep({
  onNextStep,
  professors,
  subjects,
  trails,
  onSaveDraft,
  draftData,
}: ProjectPageProps) {
  const {
    formState: { errors },
    getValues,
    register,
    setError,
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

  const selectedTrails = watch('trailsIds') || []

  const selectedTrailsNames = selectedTrails.map(
    trailId => trails?.find(trail => trail.id === trailId)?.name ?? '',
  )

  const trailTheme =
    selectedTrails.length > 0
      ? selectedTrails.length > 1
        ? [trailsIcons.SMD[2], trailsIcons.SMD[3], trailsIcons.SMD[1]]
        : [
            trailsIcons[selectedTrailsNames[0]][2],
            trailsIcons[selectedTrailsNames[0]][3],
            trailsIcons[selectedTrailsNames[0]][1],
          ]
      : [cn('text-deck-secondary-text'), cn('bg-deck-bg-button')]

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return
    }

    const file = event.target.files[0]

    setValue('banner', file)
    setBannerUrl(URL.createObjectURL(file))
  }

  const [hasSecondProfessor, setHasSecondProfessor] = useState(
    getValues('professorsIds')?.length === 2,
  )

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

  function validateStep() {
    const values = getValues()
    let hasError = false

    if (!values.title) {
      setError('title', { message: 'Campo Obrigatório' })
      hasError = true
    }

    if (!values.trailsIds) {
      setError('trailsIds', { message: 'Campo Obrigatório' })
      hasError = true
    }

    if (!values.semester) {
      setError('semester', { message: 'Campo Obrigatório' })
      hasError = true
    }

    if (!values.publishedYear) {
      setError('publishedYear', { message: 'Campo Obrigatório' })
      hasError = true
    }

    if (!values.description) {
      setError('description', { message: 'Campo Obrigatório' })
      hasError = true
    }

    return hasError
  }

  function handleNextStep() {
    const hasError = validateStep()

    if (hasError) {
      return
    }

    onNextStep()
  }

  function handleSaveDraft() {
    const hasTitle = getValues('title')

    if (!hasTitle) {
      return setError('title', { message: 'Campo Obrigatório' })
    }

    onSaveDraft()
  }

  return (
    <main className="flex w-full max-w-[860px] flex-col items-center justify-center gap-6">
      <div className="relative h-[300px] w-full overflow-hidden">
        <div
          className="flex h-[300px] w-full bg-slate-200"
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

      <div className="flex w-full flex-col items-start gap-2">
        <Label
          htmlFor="title"
          className={`flex items-center gap-2.5 text-xs ${errors.title ? 'text-red-800' : 'text-deck-secondary-text'}`}
        >
          TÍTULO (MAX. 29 CARACTERES) *
          {errors.title && <AlertCircle className="size-4 text-red-800" />}
        </Label>

        <input
          className={`w-full border-b-2 bg-transparent pb-1 font-semibold text-3xl placeholder-deck-darkest focus:outline-none ${
            errors.title ? 'border-red-800' : 'border-slate-700'
          }`}
          type="text"
          placeholder="Digite um Título"
          {...register('title')}
        />
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

        <div className="mt-2 flex items-start gap-4">
          {trails ? (
            <ToggleGroup
              defaultValue={draftData?.trailsIds || selectedTrails || []}
              onValueChange={value => {
                setValue('trailsIds', value)
                trigger('trailsIds')
              }}
              className="flex gap-4"
              type="multiple"
              {...register('trailsIds')}
            >
              {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Isso é seguro */}
              {trails?.map(option => {
                const [Icon, color, textColor, bgColor] =
                  trailsIcons[option.name]

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
      </div>

      <div className="flex w-full flex-row items-start gap-4">
        <div className="flex w-[165px] flex-col gap-2">
          <Label htmlFor="subject" className="text-deck-secondary-text text-xs">
            DISCIPLINA
          </Label>

          <Select
            defaultValue={draftData?.subjectId || watch('subjectId') || ''}
            onValueChange={value => setValue('subjectId', value)}
            {...register('subjectId')}
          >
            <SelectTrigger className={cn(trailTheme[0], trailTheme[1])}>
              <SelectValue placeholder="Insira a disciplina" />
            </SelectTrigger>

            <SelectContent className={cn('w-[300px]', trailTheme[1])}>
              {subjects?.map(subject => (
                <SelectItem
                  key={subject.id}
                  value={subject.id}
                  className="w-full overflow-hidden truncate text-ellipsis focus:bg-deck-bg"
                >
                  <span className="line-clamp-1 w-full">{subject.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[164px] flex-col gap-2">
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
            defaultValue={
              (draftData?.semester && String(draftData?.semester)) ||
              (watch('semester') && String(watch('semester'))) ||
              ''
            }
            onValueChange={value => setValue('semester', Number(value))}
            {...register('semester')}
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
        </div>

        <div className="flex w-[128px] flex-col gap-2">
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
            defaultValue={
              (draftData?.publishedYear && String(draftData?.publishedYear)) ||
              (watch('publishedYear') && String(watch('publishedYear'))) ||
              ''
            }
            onValueChange={value => setValue('publishedYear', Number(value))}
            {...register('publishedYear')}
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
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label
          htmlFor="professors"
          className="text-deck-secondary-text text-xs"
        >
          PROFESSORES (MÁX. 2)
        </Label>

        <div className="flex flex-row items-center gap-3">
          <Select
            defaultValue={
              draftData?.professorsIds?.[0] ||
              getValues('professorsIds')?.[0] ||
              ''
            }
            onValueChange={value => {
              const currentProfessors = getValues('professorsIds') || []
              currentProfessors[0] = value
              setValue('professorsIds', currentProfessors)
            }}
          >
            <SelectTrigger
              className={cn('w-[140px]', trailTheme[1], trailTheme[0])}
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
              defaultValue={
                draftData?.professorsIds?.[1] ||
                getValues('professorsIds')?.[1] ||
                ''
              }
              onValueChange={value => {
                const currentProfessors = getValues('professorsIds') || []
                currentProfessors[1] = value
                setValue('professorsIds', currentProfessors)
              }}
            >
              <SelectTrigger
                className={cn('w-[140px]', trailTheme[1], trailTheme[0])}
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

      <div className="mb-6 flex w-full flex-row justify-end gap-2">
        <Button onClick={handleSaveDraft} type="button" size="sm">
          Salvar Rascunho
        </Button>

        <Button onClick={handleNextStep} type="button" variant="dark" size="sm">
          Avançar
        </Button>
      </div>
    </main>
  )
}
