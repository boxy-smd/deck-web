import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert, Pencil, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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

  const onSubmit = (data: Schema) => {
    updateFormData(data)
    nextStep()
  }

  return (
    <div className="flex gap-8">
      <div className="flex min-h-[610px] w-[420px] flex-col rounded-md border-2 px-8 pt-9 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-24">
          <div>
            <div className="flex justify-center">
              <div className="flex h-[100px] w-[100px] justify-items-center rounded-full bg-slate-300">
                <User className="m-auto h-14 w-14 text-slate-700" />
                <div className="absolute mx-16 my-16 flex h-[40px] w-[40px] items-center justify-center rounded-full border-2 bg-slate-200">
                  <Pencil className="h-6 w-6 text-slate-700" />
                </div>
              </div>
            </div>

            <div className="pt-[30px]">
              <div>
                <p className="text-[14px] text-slate-900">Username</p>

                <Input
                  className={`mt-3 w-[356px] border-2 text-[16px] placeholder-slate-700 focus:border-none focus:outline-none focus:ring-0 focus:ring-slate-500 ${errors.username ? 'border-red-800' : 'ring-slate-500'}`}
                  type="text"
                  placeholder="Crie um username"
                  {...register('username')}
                  onBlur={() => trigger('username')}
                />

                {errors.username && (
                  <div className="flex items-center gap-2 pt-3">
                    <CircleAlert className="h-4 w-4 text-red-800" />
                    <p className="text-[14px] text-red-800">
                      {errors.username.message}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-6">
                <p className="text-[14px] text-slate-900">Nome</p>

                <Input
                  className={`mt-3 w-[356px] border-2 text-[16px] placeholder-slate-700 focus:border-none focus:outline-none focus:ring-0 focus:ring-slate-500 ${
                    errors.firstName || errors.lastName
                      ? 'border-red-800'
                      : 'ring-slate-500'
                  }`}
                  type="text"
                  placeholder="Insira seu nome"
                  {...register('firstName')}
                  onBlur={() => trigger('firstName')}
                />
              </div>

              <div className="pt-6">
                <p className="text-[14px] text-slate-900">Sobrenome</p>

                <Input
                  className={`mt-3 w-[356px] border-2 text-[16px] placeholder-slate-700 focus:border-none focus:outline-none focus:ring-0 focus:ring-slate-500 ${
                    errors.firstName || errors.lastName
                      ? 'border-red-800'
                      : 'ring-slate-500'
                  }`}
                  type="text"
                  placeholder="Insira seu sobrenome"
                  {...register('lastName')}
                  onBlur={() => trigger('lastName')}
                />
              </div>

              {(errors.firstName || errors.lastName) && (
                <div className="flex items-center gap-2 pt-6">
                  <CircleAlert className="h-4 w-4 text-red-800" />
                  <p className="text-[14px] text-red-800">
                    {errors.firstName?.message || errors.lastName?.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isValid}
              className={`w-[356px] rounded-md bg-slate-700 py-2 text-slate-100 ${isValid ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
            >
              Próximo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
