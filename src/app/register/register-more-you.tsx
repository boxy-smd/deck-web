import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-label'
import { CircleAlert, Image, Plus } from 'lucide-react'
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
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const handleSubmitForm = (data: Schema) => {
    updateFormData(data)
    onSubmit()
  }

  return (
    <div className="flex gap-8">
      <div className="flex min-h-[610px] w-[420px] flex-col rounded-md border-2 px-8 pt-9 pb-8">
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-9">
          <div>
            <div>
              <h1 className="font-semibold text-3xl text-slate-900">
                Finalize seu Perfil!
              </h1>
              <p className="mt-3 text-base leading-[18px]">
                Esse é o seu espaço para compartilhar um pouco mais sobre você.
              </p>
            </div>

            <div className="pt-6">
              <div>
                <Label className="text-[14px] text-slate-900">
                  Semestre Atual
                </Label>

                <Select
                  onValueChange={value => {
                    setValue('semester', Number(value))
                    trigger('semester')
                  }}
                >
                  <SelectTrigger className="mt-3 h-[43px] w-[356px] rounded-sm bg-slate-100 px-2 py-2 text-base">
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

              <div className="pt-4">
                <Label className="text-[14px] text-slate-900">
                  Trilhas de Interesse
                </Label>

                <div className="mt-3">
                  <ToggleGroup
                    className="flex flex-wrap justify-start gap-[6px]"
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
                        className="flex h-[30px] items-center justify-center rounded-2xl border px-3 py-2"
                      >
                        <div className="flex flex-row items-center gap-2">
                          <Image className="h-[18px] w-[18px]" />
                          <p className="text-sm">{option.label}</p>
                          <Plus className="h-[18px] w-[18px]" />
                        </div>
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>

              <div className="pt-4">
                <Label className=" text-slate-900 text-sm">Sobre</Label>

                <Textarea
                  placeholder="Fale um pouco sobre você."
                  className="mt-3 h-[100px] w-[356px] resize-none border-2 text-base placeholder-slate-700 focus:border-none focus:outline-none focus:ring-0 focus:ring-slate-500"
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
          <div>
            <Button
              type="submit"
              disabled={!isValid}
              className={`w-[356px] rounded-md bg-slate-700 py-2 text-slate-100 ${
                isValid ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
              }`}
            >
              Concluir Cadastro
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
