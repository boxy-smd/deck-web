'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Image, Plus } from 'lucide-react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from './ui/button'

const generateId = () => Math.random().toString(36).substring(2, 9)

const trailsOptions = [
  {
    id: generateId(),
    value: 'design',
    label: 'Design',
    imageSrc: 'designImageSrc',
  },
  {
    id: generateId(),
    value: 'sistemas',
    label: 'Sistemas',
    imageSrc: 'sistemasImageSrc',
  },
  {
    id: generateId(),
    value: 'audiovisual',
    label: 'Audiovisual',
    imageSrc: 'audiovisualImageSrc',
  },
  {
    id: generateId(),
    value: 'jogos',
    label: 'Jogos',
    imageSrc: 'jogosImageSrc',
  },
]

const courses = [
  {
    id: generateId(),
    value: 'design_graficas',
    label: 'Design de Interfaces Gráficas',
  },
  {
    id: generateId(),
    value: 'interacao_humano_computador',
    label: 'Interação Humano-Computador I',
  },
  {
    id: generateId(),
    value: 'autorcao_multimidia',
    label: 'Autoração Multimídia II',
  },
  {
    id: generateId(),
    value: 'cibercultura',
    label: 'Introdução à Cibercultura',
  },
]

const semesters = [
  { id: generateId(), value: '1', label: '1º Semestre' },
  { id: generateId(), value: '2', label: '2º Semestre' },
  { id: generateId(), value: '3', label: '3º Semestre' },
  { id: generateId(), value: '4', label: '4º Semestre' },
]

const professors = [
  { id: generateId(), value: 'inga_saboia', label: 'Inga Saboia' },
  { id: generateId(), value: 'henrique_pequeno', label: 'Henrique Pequeno' },
  { id: generateId(), value: 'clemilson', label: 'Clemilson' },
  { id: generateId(), value: 'eduardo_junqueira', label: 'Eduardo Junqueira' },
]

const years = [
  { id: generateId(), value: '2024', label: '2024' },
  { id: generateId(), value: '2023', label: '2023' },
  { id: generateId(), value: '2022', label: '2022' },
  { id: generateId(), value: '2021', label: '2021' },
]

const createProjectSchema = z.object({
  title: z.string().max(29).min(1),
  trails: z.array(z.string()).min(1),
  course: z.string().optional(),
  semester: z.string(),
  year: z.string(),
  description: z.string(),
  professors: z.array(z.string()).max(2).optional(),
})

type CreateProjectSchema = z.infer<typeof createProjectSchema>

interface ProjectPageProps {
  setShouldItGoNext(response: boolean): void
}

export function CreateProjectForm({ setShouldItGoNext }: ProjectPageProps) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
  })

  const handleCreateProject: SubmitHandler<CreateProjectSchema> = () => {
    setShouldItGoNext(true)
  }

  return (
    <form onSubmit={handleSubmit(handleCreateProject)}>
      <div className="flex flex-col gap-8">
        <div className="flex h-[300px] w-full flex-end bg-slate-200">
          <div className="mx-4 my-4 flex h-full w-full max-w-sm flex-end flex-col items-center gap-1.5">
            <Input id="picture" type="file" />
          </div>
        </div>
        <div className="flex w-[1100px] flex-col items-start gap-2">
          <p className="text-[12px] text-slate-500">
            TÍTULO (MAX. 29 CARACTERES)*
          </p>
          <input
            className={`w-[1100px] border-b-2 font-bold text-3xl placeholder-slate-700 ${
              errors.title ? 'border-red-500' : 'border-slate-700'
            }`}
            type="text"
            placeholder="Digite um Título"
            {...register('title')}
          />
        </div>
        <div>
          <p
            className={`text-[12px] ${
              errors.trails ? 'text-red-500' : 'text-slate-500'
            }`}
          >
            TRILHAS*
          </p>
          <div className="mt-2 flex items-start gap-4">
            <ToggleGroup
              className="flex gap-4"
              variant="default"
              type="multiple"
              {...register('trails')}
              onValueChange={value => setValue('trails', value)}
            >
              {trailsOptions.map(option => (
                <ToggleGroupItem key={option.value} value={option.value}>
                  <div className="item-center flex flex-row gap-2 rounded-full">
                    <Image className="size-5" />
                    <p className="text-sm">{option.label}</p>
                  </div>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
        <div className="flex flex-row items-start gap-8">
          <div>
            <p className="text-[12px] text-slate-500">DISCIPLINA</p>
            <Select onValueChange={value => setValue('course', value)}>
              <SelectTrigger className="w-[180px] rounded-full bg-slate-100 px-2 py-1">
                <SelectValue
                  className="text-slate-600"
                  placeholder="Insira a Disciplina"
                />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.value} value={course.value}>
                    {course.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p
              className={`text-[12px] ${
                errors.semester ? 'text-red-500' : 'text-slate-500'
              }`}
            >
              SEMESTRE*
            </p>
            <Select onValueChange={value => setValue('semester', value)}>
              <SelectTrigger className="w-[180px] rounded-full bg-slate-100 px-2 py-1">
                <SelectValue
                  className="text-slate-600"
                  placeholder="Insira o semestre"
                />
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
          <div>
            <p
              className={`text-[12px] ${
                errors.year ? ' text-red-500' : 'text-slate-500'
              }`}
            >
              ANO*
            </p>
            <Select onValueChange={value => setValue('year', value)}>
              <SelectTrigger className="w-[180px] rounded-full bg-slate-100 px-2 py-1">
                <SelectValue
                  className="text-slate-600"
                  placeholder="Insira o ano"
                />
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
        <div>
          <p
            className={`text-[12px] ${
              errors.description ? ' text-red-500' : 'text-slate-500'
            }`}
          >
            DESCRIÇÃO*
          </p>
          <Textarea
            className={`${
              errors.description ? 'border-red-500' : 'border-slate-500'
            }`}
            {...register('description')}
            placeholder="Digite a descrição"
          />
        </div>
        <div>
          <p className="text-[12px] text-slate-500">PROFESSORES (MÁX. 2)</p>
          <div className="flex flex-row items-center gap-3">
            <Select
              onValueChange={value => {
                const currentProfessors = getValues('professors') || []
                if (currentProfessors.length < 2) {
                  setValue('professors', [...currentProfessors, value])
                }
              }}
            >
              <SelectTrigger className="w-[180px] rounded-full bg-slate-100 px-2 py-1">
                <SelectValue
                  className="text-slate-600"
                  placeholder="Insira o nome"
                />
              </SelectTrigger>
              <SelectContent>
                {professors.map(professor => (
                  <SelectItem key={professor.value} value={professor.value}>
                    {professor.label}
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
          <Button
            className="rounded-md bg-slate-200 px-2 py-2 text-slate-700"
            type="button"
          >
            Salvar Rascunho
          </Button>
          <Button
            className="rounded-md bg-slate-700 px-2 py-2 text-slate-100"
            type="submit"
          >
            Avançar
          </Button>
        </div>
      </div>
    </form>
  )
}
