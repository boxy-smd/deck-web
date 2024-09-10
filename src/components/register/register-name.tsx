import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Pencil, User2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type ChangeEvent, useState } from 'react'

const nameRegex = /^[a-zA-Z\s]+$/

const schema = z
  .object({
    firstName: z
      .string()
      .min(1, 'O nome é obrigatório')
      .regex(nameRegex, 'O nome deve conter apenas letras'),
    lastName: z
      .string()
      .min(1, 'O sobrenome é obrigatório')
      .regex(nameRegex, 'O sobrenome deve conter apenas letras'),
    username: z
      .string()
      .min(3, 'Username deve ter pelo menos 3 caracteres')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'O User Único deve conter apenas letras, números, hífens ou underscores',
      ),
  })
  .refine(
    data => nameRegex.test(data.firstName) && nameRegex.test(data.lastName),
    {
      message: 'O nome e sobrenome devem conter apenas letras',
      path: ['lastName'],
    },
  )

type Schema = z.infer<typeof schema>

interface RegisterNameProps {
  nextStep: () => void
  updateFormData: (data: Schema) => void
}

export function RegisterName({ nextStep, updateFormData }: RegisterNameProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const [image, setImage] = useState<File | null>(null)

  function onSubmit(data: Schema) {
    updateFormData(data)
    nextStep()
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files

    if (files && files.length > 0) {
      setImage(files[0])
    }

    return
  }

  return (
    <div className="flex min-h-[610px] w-[420px] flex-col rounded-md border px-8 py-9">
      <form
        className="flex flex-grow flex-col justify-between"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <div className="flex justify-center">
            {image ? (
              <div className="flex size-24 justify-items-center rounded-full bg-slate-300">
                <img
                  alt="Profile pic."
                  src={URL.createObjectURL(image)}
                  className="size-24 rounded-full"
                />

                <label
                  htmlFor="profile-image"
                  className="absolute m-16 flex size-[40px] cursor-pointer items-center justify-center rounded-full border-2 bg-slate-200"
                >
                  <Pencil className="size-6 text-slate-700" />
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
              <Label className="text-slate-900 text-sm">Username</Label>

              <Input
                className="mt-2"
                variant={errors.username ? 'error' : 'default'}
                type="text"
                placeholder="Crie um username"
                {...register('username')}
                onBlur={() => trigger('username')}
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
              <Label className="text-slate-900 text-sm">Nome</Label>

              <Input
                className="mt-2"
                variant={errors.firstName ? 'error' : 'default'}
                type="text"
                placeholder="Insira seu nome"
                {...register('firstName')}
                onBlur={() => trigger('firstName')}
              />
            </div>

            <div className="w-full">
              <Label className="text-slate-900 text-sm">Sobrenome</Label>
              <Input
                className="mt-2"
                variant={errors.lastName ? 'error' : 'default'}
                type="text"
                placeholder="Insira seu sobrenome"
                {...register('lastName')}
                onBlur={() => trigger('lastName')}
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
          className="w-full"
          variant="dark"
          type="submit"
          disabled={!isValid}
        >
          Avançar
        </Button>
      </form>
    </div>
  )
}
