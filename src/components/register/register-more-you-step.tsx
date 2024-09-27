import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useTagsDependencies } from '@/contexts/hooks/use-tags-dependencies'
import type { RegisterFormSchema } from '@/hooks/auth/use-register'
import { cn } from '@/lib/utils'
import { CircleAlert, Plus, X } from 'lucide-react'
import type { ElementType } from 'react'
import { useFormContext } from 'react-hook-form'
import { Audiovisual } from '../assets/audiovisual'
import { Design } from '../assets/design'
import { Games } from '../assets/games'
import { Systems } from '../assets/systems'

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

const trailsIcons: Record<string, [ElementType, string, string, string]> = {
  Design: [Design, '#980C0C', cn('text-deck-red-dark'), cn('bg-deck-red-light')],
  Sistemas: [Systems, '#00426E', cn('text-deck-blue-dark'), cn('bg-deck-blue-light')],
  Audiovisual: [Audiovisual, '#8A3500', cn('text-deck-orange-dark'), cn('bg-deck-orange-light')],
  Jogos: [Games, '#007F05', cn('text-deck-green-dark'), cn('bg-deck-green-light')],
}

export function MoreYouRegisterStep() {
  const { trails } = useTagsDependencies()

  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useFormContext<RegisterFormSchema>()

  const selectedTrails = watch('trails')

  const watchAllFields = watch(['semester', 'trails', 'about'])

  const isFormValid =
    !Object.values(errors).some(Boolean) && watchAllFields.every(Boolean)

  return (
    <div className="flex min-h-[610px] w-[420px] flex-col rounded-md border-2 px-8 pt-9 pb-8">
      <div className="flex flex-grow flex-col justify-between">
        <div>
          <h1 className="font-semibold text-[32px] text-deck-darkest leading-none">
            Finalize seu Perfil!
          </h1>

          <p className="pt-3 text-base text-deck-secondary-text leading-tight">
            Esse é o seu espaço para compartilhar um pouco mais sobre você.
          </p>

          <div className="flex w-full flex-col items-center gap-5 pt-6">
            <div className="w-full">
              <Label className="text-deck-secondary-text text-sm leading-none">
                Semestre Atual
              </Label>

              <Select
                onValueChange={value => {
                  setValue('semester', Number(value))
                  trigger('semester')
                }}
              >
                <SelectTrigger className="mt-2 rounded-md border border-deck-border bg-deck-bg p-3">
                  <SelectValue
                    className="text-deck-placeholder"
                    placeholder="Selecione o seu semestre"
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
              <Label className="text-deck-secondary-text text-sm leading-none">
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
                  {trails.data?.map(option => {
                    const [Icon, color, textColor, bgColor] = trailsIcons[option.name]

                    return (
                      <ToggleGroupItem
                        key={option.id}
                        value={option.id}
                        className={cn(
                          'rounded-[18px] border-2 border-deck-border bg-deck-clear-tone',
                          selectedTrails?.includes(option.id)
                            ? bgColor
                            : '#F1F3F9',
                        )}
                        variant={
                          selectedTrails?.includes(option.id)
                            ? 'addedTo'
                            : 'toAdd'
                        }
                        size="tag"
                      >
                        <div className="flex flex-row items-center gap-2">
                          <Icon
                            innerColor={
                              selectedTrails?.includes(option.id)
                                ? color
                                : '#70677B'
                            }
                            foregroundColor="transparent"
                            className="size-6"
                          />

                          <p
                            className={cn(
                              'text-sm',
                              selectedTrails?.includes(option.id)
                                ? textColor
                                : 'text-deck-placeholder',
                            )}
                          >
                            {option.name}
                          </p>

                          {selectedTrails?.includes(option.id) ? (
                            <X className={
                              cn(
                                'size-[18px]',
                                selectedTrails?.includes(option.id) ? textColor : 'text-deck-placeholder'
                              )
                            } />
                          ) : (
                            <Plus className="size-[18px]" />
                          )}
                        </div>
                      </ToggleGroupItem>
                    )
                  })}
                </ToggleGroup>
              </div>
            </div>

            <div className="w-full">
              <Label className="text-deck-secondary-text text-sm leading-none">
                Sobre
              </Label>

              <Textarea
                placeholder="Escreva sobre você"
                className="mt-2 h-[100px] w-[356px] resize-none border-2 text-base placeholder-deck-placeholder"
                maxLength={200}
                {...register('about')}
                onBlur={() => trigger('about')}
              />
              {errors.about && (
                <div className="flex items-center gap-2 py-3">
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
