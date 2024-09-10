import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-label'
import { CircleAlert, Image, Plus, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

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

const semesters = [
  { id: generateId(), value: '1', label: '1º Semestre' },
  { id: generateId(), value: '2', label: '2º Semestre' },
  { id: generateId(), value: '3', label: '3º Semestre' },
  { id: generateId(), value: '4', label: '4º Semestre' },
]

const schema = z
  .object({
    semester: z.coerce.number().int().min(1, 'Semestre é obrigatório'),
    trails: z
      .array(z.string())
      .min(1, 'Pelo menos uma trilha de interesse deve ser selecionada'),
    about: z
      .string()
      .max(200, 'Máximo de 200 caracteres')
      .min(1, 'Sobre é obrigatório'),
  })
  .refine(data => data.semester && data.trails.length > 0 && data.about, {
    message: 'Preencha todos os campos',
    path: ['about'],
  })

type Schema = z.infer<typeof schema>

interface MoreYouRegisterProps {
  updateFormData: (data: Schema) => void
  onSubmit: () => void
}

export function MoreYouRegister({
  updateFormData,
  onSubmit,
}: MoreYouRegisterProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
    watch,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const selectedTrails = watch('trails')

  function handleSubmitForm(data: Schema) {
    updateFormData(data)
    onSubmit()
  }

  return (
    <div className="flex min-h-[610px] w-[420px] flex-col rounded-md border-2 px-8 pt-9 pb-8">
      <form
        className="flex flex-grow flex-col justify-between"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <div>
          <div>
            <h1 className="font-semibold text-[32px] text-slate-900 leading-none">
              Finalize seu Perfil!
            </h1>

            <p className="pt-3 text-base text-slate-500 leading-tight">
              Esse é o seu espaço para compartilhar um pouco mais sobre você.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-5 pt-6">
            <div className="w-full">
              <Label className="text-slate-900 text-sm leading-none">
                Semestre Atual
              </Label>

              <Select
                onValueChange={value => {
                  setValue('semester', Number(value))
                  trigger('semester')
                }}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue
                    className="text-slate-500"
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

            <div className="w-full">
              <Label className="text-slate-900 text-sm leading-none">
                Trilhas de Interesse
              </Label>

              <div className="mt-2">
                <ToggleGroup
                  className="flex flex-wrap justify-start gap-3"
                  type="multiple"
                  onValueChange={value => {
                    setValue('trails', value)
                    trigger('trails')
                  }}
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
                          <Plus className="size-[18px]" />
                        ) : (
                          <X className="size-[18px]" />
                        )}
                      </div>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>

            <div className="w-full">
              <Label className="text-slate-900 text-sm leading-none">
                Sobre
              </Label>

              <Textarea
                placeholder="Fale um pouco sobre você."
                className="mt-2 h-[100px] w-[356px] resize-none border-2 text-base placeholder-slate-700 focus:border-none focus:outline-none focus:ring-0 focus:ring-slate-500"
                maxLength={200}
                {...register('about')}
                onBlur={() => trigger('about')}
              />
              {errors.about && (
                <div className="flex items-center gap-2 pt-3">
                  <CircleAlert className="h-4 w-4 text-red-800" />
                  <p className="text-[14px] text-red-800">
                    {errors.about.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          variant="dark"
          type="submit"
          disabled={!isValid}
        >
          Concluir
        </Button>
      </form>
    </div>
  )
}
