'use client'

import type { ProjectInfo } from '@/app/project/[projectid]/edit/page'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { zodResolver } from '@hookform/resolvers/zod'
import { Image, Plus, X } from 'lucide-react'
import { type ChangeEvent, useEffect, useState } from 'react'
import type React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'
import { Label } from './ui/label'

const generateId = () => Math.random().toString(36).substring(2, 9)

const semesters = [
  { id: generateId(), value: '1º Semestre', label: '1º Semestre' },
  { id: generateId(), value: '2º Semestre', label: '2º Semestre' },
  { id: generateId(), value: '3º Semestre', label: '3º Semestre' },
  { id: generateId(), value: '4º Semestre', label: '4º Semestre' },
]

const years = [
  { id: generateId(), value: '2024', label: '2024' },
  { id: generateId(), value: '2023', label: '2023' },
  { id: generateId(), value: '2022', label: '2022' },
  { id: generateId(), value: '2021', label: '2021' },
]

const createProjectSchema = z.object({
  banner: z.instanceof(File).optional(),
  title: z.string().max(29).min(1),
  trails: z.array(z.string()).min(1),
  subject: z.string().optional(),
  semester: z.string(),
  year: z.string(),
  description: z.string().min(1),
  professors: z.array(z.string()).max(2).optional(),
})

type CreateProjectSchema = z.infer<typeof createProjectSchema>

interface ProjectPageProps {
  nextStep(): void
  setProjectInfos(data: ProjectInfo): void
  setBanner(files: File): void
  banner: File | undefined
}

interface Trail {
  id: string
  name: string
}
interface Professor {
  id: string
  name: string
}

interface Subject {
  id: string
  name: string
}

export function CreateProjectForm({
  nextStep,
  setProjectInfos,
  banner,
  setBanner,
}: ProjectPageProps) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    trigger,
    watch,
  } = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
  })

  const [trails, setTrails] = useState<Trail[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  async function fetchData(
    url: string,
    setter: React.Dispatch<
      React.SetStateAction<Trail[] | Professor[] | Subject[]>
    >,
    dataKey: string,
  ) {
    try {
      const response = await fetch(url)
      const data = await response.json()
      setter(data[dataKey])
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
    }
  }

  const getTrails = () =>
    fetchData('https://deck-api.onrender.com/trails', setTrails, 'trails')
  const getProfessors = () =>
    fetchData(
      'https://deck-api.onrender.com/professors',
      setProfessors,
      'professors',
    )
  const getSubjects = () =>
    fetchData('https://deck-api.onrender.com/subjects', setSubjects, 'subjects')

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getTrails()
    getProfessors()
    getSubjects()
  }, [])
  const selectedTrails = watch('trails')

  function handleCreateProject(data: ProjectInfo) {
    nextStep()
    console.log(data)
    setProjectInfos(data)
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files

    if (files && files.length > 0) {
      setValue('banner', files[0])
      setBanner(files[0])
    }

    console.log(files)

    return
  }

  return (
    <form
      className="flex w-full flex-col items-center justify-center gap-6 px-[140px]"
      onSubmit={handleSubmit(handleCreateProject)}
    >
      <div className="relative h-[300px] w-full overflow-hidden">
        {banner ? (
          <div
            className="flex h-[300px] w-full flex-end bg-slate-200"
            style={{
              backgroundImage: URL.createObjectURL(banner)
                ? `url(${URL.createObjectURL(banner)})`
                : undefined, // Set background image dynamically
              backgroundSize: 'cover', // Ensure the image covers the entire div
              backgroundPosition: 'center', // Center the background image
            }}
          />
        ) : (
          <div className="flex h-full w-full bg-slate-200" />
        )}

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
        type="file"
        id="banner"
        className="invisible size-0"
      />

      <div className="flex w-full flex-col items-start gap-2">
        <Label
          htmlFor="title"
          className={`text-xs ${errors.title ? 'text-red-800' : 'text-slate-500'}`}
        >
          TÍTULO (MAX. 29 CARACTERES)*
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
          className={`text-xs ${
            errors.trails ? 'text-red-800' : 'text-slate-500'
          }`}
        >
          TRILHAS*
        </Label>

        <div className="mt-2 flex items-start gap-4">
          <ToggleGroup
            onValueChange={value => {
              setValue('trails', value)
              trigger('trails')
            }}
            className="flex gap-4"
            type="multiple"
          >
            {trails.map(option => (
              <ToggleGroupItem
                key={option.id}
                value={option.name}
                variant={
                  selectedTrails?.includes(option.name) ? 'addedTo' : 'toAdd'
                }
                size="tag"
              >
                <div className="flex flex-row items-center gap-2">
                  <Image className="size-[18px]" />

                  <p className="text-sm">{option.name}</p>

                  {selectedTrails?.includes(option.name) ? (
                    <X className="size-[18px]" />
                  ) : (
                    <Plus className="size-[18px]" />
                  )}
                </div>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <div className="flex w-full flex-row items-start gap-4">
        <div className="flex w-[165px] flex-col gap-2">
          <Label htmlFor="subject" className="text-slate-500 text-xs">
            DISCIPLINA
          </Label>

          <Select onValueChange={value => setValue('subject', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Insira a Disciplina" />
            </SelectTrigger>

            <SelectContent>
              {subjects.map(subject => (
                <SelectItem key={subject.id} value={subject.name}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[140px] flex-col gap-2">
          <Label
            htmlFor="semester"
            className={`text-xs ${
              errors.semester ? 'text-red-800' : 'text-slate-500'
            }`}
          >
            SEMESTRE*
          </Label>

          <Select onValueChange={value => setValue('semester', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Insira o semestre" />
            </SelectTrigger>

            <SelectContent>
              {semesters.map(semester => (
                <SelectItem key={semester.value} value={semester.value}>
                  {semester.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[128px] flex-col gap-2">
          <Label
            htmlFor="year"
            className={`text-xs ${
              errors.year ? ' text-red-800' : 'text-slate-500'
            }`}
          >
            ANO*
          </Label>

          <Select onValueChange={value => setValue('year', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Insira o ano" />
            </SelectTrigger>

            <SelectContent>
              {years.map(year => (
                <SelectItem key={year.id} value={year.value}>
                  {year.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label
          className={`text-xs ${
            errors.description ? ' text-red-800' : 'text-slate-500'
          }`}
        >
          DESCRIÇÃO*
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
            onValueChange={value => {
              const currentProfessors = getValues('professors') || []

              if (currentProfessors.length < 2) {
                setValue('professors', [...currentProfessors, value])
              }
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Insira o nome" />
            </SelectTrigger>

            <SelectContent>
              {professors.map(professor => (
                <SelectItem key={professor.id} value={professor.name}>
                  {professor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="rounded-full bg-slate-100 p-2">
            <Plus className="size-4 text-slate-600" />
          </div>
        </div>
      </div>

      <div className="mb-6 flex w-full flex-row justify-end gap-2">
        <Button size="sm">Salvar Rascunho</Button>

        <Button variant="dark" type="submit" size="sm">
          Avançar
        </Button>
      </div>
    </form>
  )
}
