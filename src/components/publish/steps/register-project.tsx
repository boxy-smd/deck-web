'use client'

import { Image, Minus, Plus, X } from 'lucide-react'
import { type ChangeEvent, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import type { CreateProjectFormSchema } from '@/app/project/[projectId]/edit/page'
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
import { AlertCircle } from 'lucide-react'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import { Skeleton } from '../../ui/skeleton'

export interface ProjectPageProps {
  onNextStep(): void
  professors: Professor[] | undefined
  subjects: Subject[] | undefined
  trails: Trail[] | undefined
  onSaveDraft(): void
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This component is complex by nature
export function RegisterProjectStep({
  onNextStep,
  professors,
  subjects,
  trails,
  onSaveDraft,
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

  const banner = watch('banner')
  const selectedTrails = watch('trailsIds')

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return
    }

    const file = event.target.files[0]

    setValue('banner', file)
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
            backgroundImage: banner
              ? `url(${URL.createObjectURL(banner)})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <Button
          asChild
          className="absolute right-4 bottom-4 cursor-pointer bg-slate-50"
          size="sm"
        >
          <Label htmlFor="banner">Editar Capa</Label>
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
          className={`flex items-center gap-2.5 text-xs ${errors.title ? 'text-red-800' : 'text-slate-500'}`}
        >
          TÍTULO (MAX. 29 CARACTERES) *
          {errors.title && <AlertCircle className="size-4 text-red-800" />}
        </Label>

        <input
          className={`w-full border-b-2 bg-transparent pb-1 font-semibold text-3xl placeholder-slate-700 focus:outline-none ${
            errors.title ? 'border-red-800' : 'border-slate-700'
          }`}
          type="text"
          placeholder="Digite um Título"
          {...register('title')}
        />
      </div>

      <div className="w-full">
        <Label
          htmlFor="trails"
          className={`flex items-center gap-2.5 text-xs ${
            errors.trailsIds ? 'text-red-800' : 'text-slate-500'
          }`}
        >
          TRILHAS *{' '}
          {errors.trailsIds && <AlertCircle className="size-4 text-red-800" />}
        </Label>

        <div className="mt-2 flex items-start gap-4">
          {trails ? (
            <ToggleGroup
              defaultValue={selectedTrails}
              onValueChange={value => {
                setValue('trailsIds', value)
                trigger('trailsIds')
              }}
              className="flex gap-4"
              type="multiple"
            >
              {trails?.map(option => (
                <ToggleGroupItem
                  key={option.id}
                  value={option.id}
                  variant={
                    selectedTrails?.includes(option.id) ? 'addedTo' : 'toAdd'
                  }
                  size="tag"
                >
                  <div className="flex flex-row items-center gap-2">
                    <Image className="size-[18px]" />

                    <p className="text-sm">{option.name}</p>

                    {selectedTrails?.includes(option.id) ? (
                      <X className="size-[18px]" />
                    ) : (
                      <Plus className="size-[18px]" />
                    )}
                  </div>
                </ToggleGroupItem>
              ))}
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
          <Label htmlFor="subject" className="text-slate-500 text-xs">
            DISCIPLINA
          </Label>

          <Select
            defaultValue={getValues('subjectId') || undefined}
            onValueChange={value => setValue('subjectId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Insira a disciplina" />
            </SelectTrigger>

            <SelectContent className="w-[300px]">
              {subjects?.map(subject => (
                <SelectItem
                  key={subject.id}
                  value={subject.id}
                  className="w-full overflow-hidden truncate text-ellipsis"
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
              errors.semester ? 'text-red-800' : 'text-slate-500'
            }`}
          >
            SEMESTRE *
            {errors.semester && <AlertCircle className="size-4 text-red-800" />}
          </Label>

          <Select
            defaultValue={
              getValues('semester') ? String(getValues('semester')) : undefined
            }
            onValueChange={value => setValue('semester', Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Insira o semestre" />
            </SelectTrigger>

            <SelectContent>
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
                  >
                    {semester.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[128px] flex-col gap-2">
          <Label
            htmlFor="year"
            className={`flex items-center gap-2.5 text-xs ${
              errors.publishedYear ? ' text-red-800' : 'text-slate-500'
            }`}
          >
            ANO *
            {errors.publishedYear && (
              <AlertCircle className="size-4 text-red-800" />
            )}
          </Label>

          <Select
            defaultValue={
              getValues('publishedYear')
                ? String(getValues('publishedYear'))
                : undefined
            }
            onValueChange={value => setValue('publishedYear', Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Insira o ano" />
            </SelectTrigger>

            <SelectContent>
              {Array.from({
                length: new Date().getFullYear() - 2013,
              })
                .map((_, index) => ({
                  value: new Date().getFullYear() - index,
                  label: `${new Date().getFullYear() - index}`,
                }))
                .map(year => (
                  <SelectItem key={year.value} value={String(year.value)}>
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
            errors.description ? ' text-red-800' : 'text-slate-500'
          }`}
        >
          DESCRIÇÃO *
          {errors.description && (
            <AlertCircle className="size-4 text-red-800" />
          )}
        </Label>

        <Textarea
          className={`h-20 ${
            errors.description ? 'border-red-800' : 'border-slate-200'
          }`}
          placeholder="Digite a descrição"
          {...register('description')}
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label htmlFor="professors" className="text-slate-500 text-xs">
          PROFESSORES (MÁX. 2)
        </Label>

        <div className="flex flex-row items-center gap-3">
          <Select
            defaultValue={getValues('professorsIds')?.[0] || undefined}
            onValueChange={value => {
              const currentProfessors = getValues('professorsIds') || []
              currentProfessors[0] = value
              setValue('professorsIds', currentProfessors)
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Insira o nome" />
            </SelectTrigger>

            <SelectContent>
              {professors?.map(professor => (
                <SelectItem key={professor.id} value={professor.id}>
                  {professor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasSecondProfessor && (
            <Select
              defaultValue={getValues('professorsIds')?.[1] || undefined}
              onValueChange={value => {
                const currentProfessors = getValues('professorsIds') || []
                currentProfessors[1] = value
                setValue('professorsIds', currentProfessors)
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Insira o nome" />
              </SelectTrigger>

              <SelectContent>
                {professors?.map(professor => (
                  <SelectItem key={professor.id} value={professor.id}>
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
              <Minus className="size-4 text-slate-600" />
            ) : (
              <Plus className="size-4 text-slate-600" />
            )}
          </Button>
        </div>
      </div>

      <div className="mb-6 flex w-full flex-row justify-end gap-2">
        <Button onClick={handleSaveDraft} type="button" size="sm">
          Salvar Rascunho
        </Button>

        <Button onClick={handleNextStep} variant="dark" size="sm">
          Avançar
        </Button>
      </div>
    </main>
  )
}
