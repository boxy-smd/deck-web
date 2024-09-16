import { Label } from '@radix-ui/react-label'
import { CircleAlert, Image, Plus, X } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

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
import type { Trail } from '@/entities/trail'
import type { RegisterFormSchema } from '@/hooks/auth/use-register'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

const semesters = [
  { value: 1, label: '1º Semestre' },
  { value: 2, label: '2º Semestre' },
  { value: 3, label: '3º Semestre' },
  { value: 4, label: '4º Semestre' },
  { value: 5, label: '5º Semestre' },
  { value: 6, label: '6º Semestre' },
  { value: 7, label: '7º Semestre' },
  { value: 8, label: '8º Semestre' },
  { value: 9, label: '9º Semestre' },
  { value: 10, label: '10º Semestre' },
  { value: 11, label: '11º Semestre' },
  { value: 12, label: '12º Semestre' },
]

export function MoreYouRegisterStep() {
  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useFormContext<RegisterFormSchema>()

  const fetchTrails = useCallback(
    () =>
      fetch('https://deck-api.onrender.com/trails').then(async response => {
        const data = (await response.json()) as { trails: Trail[] }

        return data.trails
      }),
    [],
  )

  const { data: trails } = useQuery<Trail[]>({
    queryKey: ['trails'],
    queryFn: fetchTrails,
  })

  const selectedTrails = watch('trails')

  const watchAllFields = watch(['semester', 'trails', 'about'])

  const isFormValid =
    !Object.values(errors).some(Boolean) && watchAllFields.every(Boolean)

  return (
    <div className="flex min-h-[610px] w-[420px] flex-col rounded-md border-2 px-8 pt-9 pb-8">
      <div className="flex flex-grow flex-col justify-between">
        <div>
          <h1 className="font-semibold text-[32px] text-slate-900 leading-none">
            Finalize seu Perfil!
          </h1>

          <p className="pt-3 text-base text-slate-500 leading-tight">
            Esse é o seu espaço para compartilhar um pouco mais sobre você.
          </p>

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
                  {trails?.map(option => (
                    <ToggleGroupItem
                      key={option.id}
                      value={option.id}
                      variant={
                        selectedTrails?.includes(option.id)
                          ? 'addedTo'
                          : 'toAdd'
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
          disabled={!isFormValid}
        >
          Concluir
        </Button>
      </div>
    </div>
  )
}
