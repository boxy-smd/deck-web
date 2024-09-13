'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Image, Plus, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import type { ProjectInfo } from '@/app/project/[projectid]/edit/page'
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
  },
  {
    id: generateId(),
    value: 'sistemas',
    label: 'Sistemas',
  },
  {
    id: generateId(),
    value: 'audiovisual',
    label: 'Audiovisual',
  },
  {
    id: generateId(),
    value: 'jogos',
    label: 'Jogos',
  },
]

const courses = [
  {
    id: generateId(),
    value: 'Design de Interfaces Gráficas',
    label: 'Design de Interfaces Gráficas',
  },
  {
    id: generateId(),
    value: 'Interação Humano-Computador I',
    label: 'Interação Humano-Computador I',
  },
  {
    id: generateId(),
    value: 'Autoração Multimídia II',
    label: 'Autoração Multimídia II',
  },
  {
    id: generateId(),
    value: 'Introdução à Cibercultura',
    label: 'Introdução à Cibercultura',
  },
]

const semesters = [
  { id: generateId(), value: '1º Semestre', label: '1º Semestre' },
  { id: generateId(), value: '2º Semestre', label: '2º Semestre' },
  { id: generateId(), value: '3º Semestre', label: '3º Semestre' },
  { id: generateId(), value: '4º Semestre', label: '4º Semestre' },
]

const professors = [
  { id: generateId(), value: 'Inga Saboia', label: 'Inga Saboia' },
  { id: generateId(), value: 'Henrique Pequeno', label: 'Henrique Pequeno' },
  { id: generateId(), value: 'Clemilson Santos', label: 'Clemilson Santos' },
  { id: generateId(), value: 'Eduardo Junqueira', label: 'Eduardo Junqueira' },
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
  description: z.string().min(1),
  professors: z.array(z.string()).max(2).optional(),
})

type CreateProjectSchema = z.infer<typeof createProjectSchema>

interface ProjectPageProps {
  nextStep(): void
  setProjectInfos(data: ProjectInfo): void
}

export function CreateProjectForm({ nextStep, setProjectInfos }: ProjectPageProps) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    trigger,
    watch
  } = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
  })

  const selectedTrails = watch('trails')

  function handleCreateProject(data: ProjectInfo) {
    nextStep()
    console.log(data)
    setProjectInfos(data);

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
          <p className={`text-sm ${errors.title ? 'text-red-800' : 'text-slate-500'}`}>
            TÍTULO (MAX. 29 CARACTERES)*
          </p>

          <input
            className={`w-[1100px] border-b-2 font-bold text-3xl placeholder-slate-700 focus:outline-none ${errors.title ? 'border-red-800' : 'border-slate-700'
              }`}
            type="text"
            placeholder="Digite um Título"
            {...register('title')}
          />
        </div>

        <div>
          <p
            className={`text-sm ${errors.trails ? 'text-red-800' : 'text-slate-500'
              }`}
          >
            TRILHAS*
          </p>

          <div className="mt-2 flex items-start gap-4">
            <ToggleGroup
              onValueChange={value => {
                setValue('trails', value)
                trigger('trails')
              }}
              className="flex gap-4"
              type="multiple"
            >
              {trailsOptions.map(option => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  variant={
                    selectedTrails?.includes(option.value)
                      ? 'addedTo'
                      : 'toAdd'
                  }
                  size="tag"
                >
                  <div className="flex flex-row items-center gap-2">
                    <Image className="size-[18px]" />
                    <p className="text-sm">{option.label}</p>
                    {selectedTrails?.includes(option.value) ? (
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

        <div className="flex flex-row items-start gap-8">
          <div className='flex flex-col gap-2'>
            <p className='text-slate-500 text-sm'>DISCIPLINA</p>

            <Select onValueChange={value => setValue('course', value)}>
              <SelectTrigger className='w-[180px] rounded-full border-none bg-slate-100 px-2 py-1'>
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

          <div className='flex flex-col gap-2'>
            <p
              className={`text-sm ${errors.semester ? 'text-red-800' : 'text-slate-500'
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

          <div className='flex flex-col gap-2'>
            <p
              className={`text-sm ${errors.year ? ' text-red-800' : 'text-slate-500'
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

        <div className='flex flex-col gap-2'>
          <p
            className={`text-sm ${errors.description ? ' text-red-800' : 'text-slate-500'
              }`}
          >
            DESCRIÇÃO*
          </p>

          <Textarea
            className={`${errors.description ? 'border-red-800' : 'border-slate-200'
              }`}
            placeholder="Digite a descrição"
            {...register('description')}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <p className='text-slate-500 text-sm'>PROFESSORES (MÁX. 2)</p>
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
          <Button size="sm">
            Salvar Rascunho
          </Button>

          <Button variant="dark" type='submit' size="sm">
            Avançar
          </Button>
        </div>
      </div>
    </form>
  )
}
