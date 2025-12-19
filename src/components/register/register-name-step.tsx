import { CircleAlert, Pencil, User2 } from 'lucide-react'
import Image from 'next/image'
import { type ChangeEvent, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { RegisterFormSchema } from '@/hooks/auth/use-register'

interface RegisterNameProps {
  onGoToNextStep: () => void
}

export function RegisterNameStep({ onGoToNextStep }: RegisterNameProps) {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<RegisterFormSchema>()

  const [image, setImage] = useState<File>()

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files

    if (files && files.length > 0) {
      setValue('profileImage', files[0])
      setImage(files[0])
    }

    return
  }

  const watchAllFields = watch(['username', 'firstName', 'lastName'])

  const isFormValid =
    !Object.values(errors).some(Boolean) && watchAllFields.every(Boolean)

  function handleNextStep() {
    onGoToNextStep()
  }

  return (
    <div className="flex min-h-[610px] w-[420px] flex-col rounded-md border px-8 py-9">
      <div className="flex flex-grow flex-col justify-between">
        <div>
          <div className="flex justify-center">
            {image ? (
              <div className="flex size-24 justify-items-center rounded-full bg-slate-300">
                <Image
                  alt="Profile pic."
                  src={URL.createObjectURL(image)}
                  className="size-24 rounded-full"
                  width={40}
                  height={40}
                />

                <label
                  htmlFor="profile-image"
                  className="absolute m-16 flex size-[40px] cursor-pointer items-center justify-center rounded-full border-2 bg-deck-bg-button"
                >
                  <Pencil className="size-6 text-deck-darkest" />
                </label>
              </div>
            ) : (
              <div className="flex size-24 justify-items-center rounded-full bg-slate-300">
                <User2 className="z-10 m-auto block size-14 text-slate-700" />

                <label
                  htmlFor="profile-image"
                  className="absolute m-16 flex size-[40px] cursor-pointer items-center justify-center rounded-full border-2 bg-slate-200"
                >
                  <Pencil className="size-6 text-slate-700" />
                </label>
              </div>
            )}

            <input
              onChange={handleImageChange}
              type="file"
              id="profile-image"
              className="invisible size-0"
            />
          </div>

          <div className="flex w-full flex-col items-center gap-5 pt-8">
            <div className="w-full">
              <Label className="text-deck-secondary-text text-sm">
                Username
              </Label>

              <Input
                className="mt-2"
                variant={errors.username ? 'error' : 'default'}
                type="text"
                placeholder="Crie um username"
                {...register('username')}
              />

              {errors.username && (
                <div className="flex items-center gap-2 pt-3">
                  <CircleAlert className="size-4 text-red-800" />
                  <p className="font-medium text-red-800 text-xs leading-none">
                    {errors.username.message}
                  </p>
                </div>
              )}
            </div>

            <div className="w-full">
              <Label className="text-deck-secondary-text text-sm">Nome</Label>

              <Input
                className="mt-2"
                variant={errors.firstName ? 'error' : 'default'}
                type="text"
                placeholder="Insira seu nome"
                {...register('firstName')}
              />
            </div>

            <div className="w-full">
              <Label className="text-deck-secondary-text text-sm">
                Sobrenome
              </Label>
              <Input
                className="mt-2"
                variant={errors.lastName ? 'error' : 'default'}
                type="text"
                placeholder="Insira seu sobrenome"
                {...register('lastName')}
              />
            </div>

            {!errors.username && (errors.firstName || errors.lastName) && (
              <div className="flex w-full items-center gap-2">
                <CircleAlert className="size-4 text-red-800" />
                <p className="font-medium text-red-800 text-xs leading-none">
                  {errors.firstName?.message || errors.lastName?.message}
                </p>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleNextStep}
          className="w-full"
          variant="dark"
          disabled={!isFormValid}
        >
          Avançar
        </Button>
      </div>
    </div>
  )
}
