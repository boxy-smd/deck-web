import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

const schema = z
  .object({
    email: z
      .string()
      .email('E-mail inválido')
      .regex(/@alu.ufc.br$/, 'E-mail inválido')
      .min(1, 'E-mail é obrigatório'),
    password: z.string().min(6, 'É necessário pelo menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type Schema = z.infer<typeof schema>

interface RegisterMailProps {
  nextStep: () => void
  updateFormData: (data: Schema) => void
}

export function RegisterMail({ nextStep, updateFormData }: RegisterMailProps) {
  const [hasInteracted, setHasInteracted] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data: Schema) => {
    updateFormData(data)
    nextStep()
  }

  const handleBlur = (field: keyof typeof hasInteracted) => {
    setHasInteracted(prev => ({ ...prev, [field]: true }))
    trigger(field)
  }

  return (
    <div className="flex min-h-[610px] w-[420px] flex-col rounded-md border px-8 py-9">
      <form
        className="flex flex-grow flex-col justify-between"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <div>
            <h1 className="font-semibold text-[32px] text-slate-900 leading-none">
              Crie uma conta!
            </h1>

            <p className="pt-3 text-base text-slate-500 leading-tight">
              Com uma conta, você poderá publicar seus projetos e interagir com
              a comunidade!
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-5 pt-8">
            <div className="w-full">
              <Label className="text-slate-900 text-sm leading-none">
                E-mail Institucional
              </Label>

              <Input
                onChangeCapture={() => handleBlur('email')}
                className="mt-2"
                variant={errors.email ? 'error' : 'default'}
                type="text"
                placeholder="agomes@alu.ufc.br"
                {...register('email')}
              />

              {errors.email && (
                <div className="flex items-center gap-2 pt-3">
                  <CircleAlert className="size-4 text-red-800" />
                  <p className="font-medium text-red-800 text-xs leading-none">
                    {errors.email.message}
                  </p>
                </div>
              )}
            </div>

            <div className="w-full">
              <Label className="text-slate-900 text-sm">Senha</Label>

              <Input
                onChangeCapture={() => handleBlur('password')}
                className="mt-2"
                variant={errors.password ? 'error' : 'default'}
                type="password"
                placeholder="••••••"
                {...register('password')}
              />

              {!errors.email && errors.password && (
                <div className="flex items-center gap-2 pt-3">
                  <CircleAlert className="size-4 text-red-800" />
                  <p className="font-medium text-red-800 text-xs leading-none">
                    {errors.password.message}
                  </p>
                </div>
              )}
            </div>

            <div className="w-full">
              <Label className="text-slate-900 text-sm">Confirmar Senha</Label>

              <Input
                onChangeCapture={() => handleBlur('confirmPassword')}
                className="mt-2"
                variant={
                  errors.password && errors.confirmPassword
                    ? 'error'
                    : 'default'
                }
                type="password"
                placeholder="••••••"
                {...register('confirmPassword')}
              />

              {!(errors.email || errors.password) && errors.confirmPassword && (
                <div className="flex items-center gap-2 pt-3">
                  <CircleAlert className="size-4 text-red-800" />
                  <p className="font-medium text-red-800 text-xs leading-none">
                    {errors.confirmPassword.message}
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
          Avançar
        </Button>
      </form>
    </div>
  )
}
