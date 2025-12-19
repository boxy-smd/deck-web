import { CircleAlert, Pencil, Plus, User2, X } from 'lucide-react'
import Image from 'next/image'
import { type ChangeEvent, type ElementType, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useTagsDependencies } from '@/contexts/hooks/use-tags-dependencies'
import type { Profile } from '@/entities/profile'
import { cn } from '@/lib/utils'
import { Audiovisual } from '../assets/audiovisual'
import { Design } from '../assets/design'
import { Games } from '../assets/games'
import { Systems } from '../assets/systems'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Textarea } from '../ui/textarea'
import type { EditProfileModalSchema } from './profile-card'

type EditProfileModalProps = Pick<Profile, 'semester' | 'trails' | 'profileUrl'>

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
}

export function EditProfileModal({
  profileUrl,
  semester: studentSemester,
  trails: studentTrails,
}: EditProfileModalProps) {
  const { trails } = useTagsDependencies()

  const {
    register,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useFormContext<EditProfileModalSchema>()

  const [image, setImage] = useState<File>()

  const selectedTrails = watch('trails')

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return
    }

    const file = event.target.files[0]

    setValue('profileImage', file)
    setImage(file)

    return
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center rounded-lg bg-slate-50">
      <div className="flex justify-center">
        {image || profileUrl ? (
          <div className="flex size-24 justify-items-center rounded-full bg-slate-300">
            <Image
              alt="Profile pic."
              src={(image && URL.createObjectURL(image)) || profileUrl || ''}
              className="size-24 rounded-full"
              width={40}
              height={40}
            />

            <label
              htmlFor="profileImage"
              className="absolute m-16 flex size-[40px] cursor-pointer items-center justify-center rounded-full border-2 bg-slate-200"
            >
              <Pencil className="size-6 text-slate-700" />
            </label>
          </div>
        ) : (
          <div className="flex size-24 justify-items-center rounded-full bg-slate-300">
            <User2 className="z-10 m-auto block size-14 text-slate-700" />

            <label
              htmlFor="profileImage"
              className="absolute m-16 flex size-[40px] cursor-pointer items-center justify-center rounded-full border-2 bg-slate-200"
            >
              <Pencil className="size-6 text-slate-700" />
            </label>
          </div>
        )}

        <input
          onChange={handleImageChange}
          draggable
          multiple={false}
          type="file"
          id="profileImage"
          accept="image/*"
          className="invisible size-0"
        />
      </div>

      <div className="flex w-full flex-col">
        <div className="flex grow flex-col justify-between">
          <div className="flex w-full flex-col items-center gap-5 pt-6">
            <div className="w-full">
              <Label className="text-slate-900 text-sm leading-none">
                Semestre Atual
              </Label>

              <Select
                defaultValue={String(studentSemester)}
                onValueChange={value => {
                  setValue('semester', Number(value))
                  trigger('semester')
                }}
                {...register('semester')}
              >
                <SelectTrigger className="mt-2 rounded-md border border-slate-200 bg-slate-100 p-3">
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
                  defaultValue={studentTrails}
                  {...register('trails')}
                >
                  {trails.data?.map(option => {
                    const [Icon, color, textColor, bgColor] =
                      trailsIcons[option.name]

                    return (
                      <ToggleGroupItem
                        key={option.id}
                        value={option.name}
                        className={cn(
                          'rounded-[18px] border-2 border-deck-border bg-deck-clear-tone',
                          selectedTrails?.includes(option.name)
                            ? bgColor
                            : '#F1F3F9',
                        )}
                        variant={
                          selectedTrails?.includes(option.name)
                            ? 'addedTo'
                            : 'toAdd'
                        }
                        size="tag"
                      >
                        <div className="flex flex-row items-center gap-2">
                          <Icon
                            innerColor={
                              selectedTrails?.includes(option.name)
                                ? color
                                : '#70677B'
                            }
                            foregroundColor="transparent"
                            className="size-6"
                          />

                          <p
                            className={cn(
                              'text-sm',
                              selectedTrails?.includes(option.name)
                                ? textColor
                                : 'text-deck-placeholder',
                            )}
                          >
                            {option.name}
                          </p>

                          {selectedTrails?.includes(option.name) ? (
                            <X
                              className={cn(
                                'size-[18px]',
                                selectedTrails?.includes(option.name)
                                  ? textColor
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
              </div>
            </div>

            <div className="w-full">
              <Label className="text-slate-900 text-sm leading-none">
                Sobre
              </Label>

              <Textarea
                placeholder="Fale um pouco sobre você."
                className="mt-2 h-[100px] w-[356px] resize-none border-2 text-base placeholder-slate-700 focus:border-none focus:outline-hidden focus:ring-0 focus:ring-slate-500"
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
      </div>
    </div>
  )
}
