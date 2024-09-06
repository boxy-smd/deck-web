import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlert } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
    <div className="flex gap-8">
      <div className="flex min-h-[610px] w-[420px] flex-col rounded-md border-2 px-8 pt-9 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[91px]">
          <div>
            <h1 className="font-semibold text-[32px] text-slate-900">
              Crie uma conta!
            </h1>

            <p className="pt-3 text-base">
              Com uma conta, você poderá publicar seus projetos e interagir com
              a comunidade!
            </p>

            <div className="pt-7">
              <Label className="text-[14px] text-slate-900">
                E-mail Institucional
              </Label>

              <Input
                className={`mt-3 w-[356px] border-2 text-base placeholder-slate-700 focus:border-none focus:outline-none focus:ring-0 focus:ring-slate-500 ${errors.email && hasInteracted.email ? ' border-red-800' : 'ring-slate-500'}`}
                type="text"
                placeholder="Insira seu e-mail"
                {...register('email')}
                onChangeCapture={() => handleBlur('email')}
              />

              {errors.email && hasInteracted.email && (
                <div className="flex items-center gap-3 pt-3">
                  <CircleAlert className="h-4 w-4 text-red-800" />
                  <p className="text-red-800">{errors.email.message}</p>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Label className="text-[14px] text-slate-900">Senha</Label>

              <Input
                className={`mt-3 w-[356px] border-2 text-base placeholder-slate-700 focus:border-none focus:outline-none focus:ring-2 focus:ring-slate-500 ${errors.password && hasInteracted.password ? ' border-red-800' : 'ring-slate-500'}`}
                type="password"
                placeholder="••••••"
                {...register('password')}
                onChangeCapture={() => handleBlur('password')}
              />

              {errors.password && hasInteracted.password && (
                <div className="flex items-center gap-3 pt-3">
                  <CircleAlert className="h-4 w-4 text-red-800" />
                  <p className="text-red-800">{errors.password.message}</p>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Label className="text-[14px] text-slate-900">
                Confirmar Senha
              </Label>

              <Input
                className={`mt-3 w-[356px] border-2 text-base placeholder-slate-700 focus:border-none focus:outline-none focus:ring-2 focus:ring-slate-500 ${errors.confirmPassword && hasInteracted.confirmPassword ? ' border-red-800' : 'ring-slate-500'}`}
                type="password"
                placeholder="••••••"
                {...register('confirmPassword')}
                onChangeCapture={() => handleBlur('confirmPassword')}
              />

              {!errors.password &&
                errors.confirmPassword &&
                hasInteracted.confirmPassword && (
                  <div className="flex items-center gap-3 pt-3">
                    <CircleAlert className="h-4 w-4 text-red-800" />
                    <p className="text-red-800">
                      {errors.confirmPassword.message}
                    </p>
                  </div>
                )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={!isValid}
              className={`w-[356px] rounded-md bg-slate-700 py-2 text-slate-100 ${isValid ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
            >
              Próximo
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
