import { CircleAlert } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { RegisterFormSchema } from '@/hooks/auth/use-register'

interface RegisterMailProps {
  onGoToNextStep: () => void
}

export function RegisterMailStep({ onGoToNextStep }: RegisterMailProps) {
  const {
    register,
    formState: { errors },
    setError,
    watch,
  } = useFormContext<RegisterFormSchema>()

  const watchAllFields = watch(['email', 'password', 'confirmPassword'])

  const isFormValid =
    !Object.values(errors).some(Boolean) && watchAllFields.every(Boolean)

  function handleNextStep() {
    const password = watchAllFields[1]
    const confirmPassword = watchAllFields[2]

    if (password !== confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'As senhas não coincidem.',
      })

      return
    }

    onGoToNextStep()
  }

  return (
    <div className="flex min-h-[610px] w-[420px] flex-col rounded-md border px-8 py-9">
      <div className="flex flex-grow flex-col justify-between">
        <div>
          <h1 className="font-semibold text-[32px] text-slate-900 leading-none">
            Crie uma conta!
          </h1>

          <p className="pt-3 text-base text-slate-500 leading-tight">
            Com uma conta, você poderá publicar seus projetos e interagir com a
            comunidade!
          </p>

          <div className="flex w-full flex-col items-center gap-5 pt-8">
            <div className="w-full">
              <Label className="text-slate-900 text-sm leading-none">
                E-mail Institucional
              </Label>

              <Input
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
