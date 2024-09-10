'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-label'
import { CircleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

const loginFormSchema = z.object({
  email: z
    .string()
    .email('E-mail inválido')
    .regex(/@alu.ufc.br$/, 'E-mail deve ser institucional')
    .min(1, 'E-mail é obrigatório'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
})

type LoginFormSchema = z.infer<typeof loginFormSchema>

export default function Login() {
  const [loginFailed, setLoginFailed] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: LoginFormSchema) => {
    const isValidLogin = await simulateLogin(data)

    if (isValidLogin) {
      setLoginFailed(false)
      console.log('Login bem-sucedido')
      router.push('/')
    } else {
      setLoginFailed(true)
    }
  }

  const simulateLogin = async (data: LoginFormSchema) => {
    return new Promise<boolean>(resolve => {
      setTimeout(() => {
        const isValid =
          data.email === 'teste@alu.ufc.br' && data.password === 'testes'
        resolve(isValid)
      }, 1000)
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="mr-16 h-[570px] w-60 bg-slate-600" />

      <div className="flex min-h-[610px] w-[420px] flex-col rounded-md border px-8 py-9">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-grow flex-col justify-between"
        >
          <div>
            <div>
              <h1 className="font-semibold text-[32px] text-slate-900 leading-none">
                Login
              </h1>

              <p className="pt-3 text-base text-slate-500 leading-tight">
                Que bom receber você novamente!
              </p>
            </div>

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
                  onBlur={() => trigger('email')}
                />
              </div>

              <div className="w-full">
                <Label className="text-slate-900 text-sm leading-none">
                  Senha
                </Label>

                <Input
                  className="mt-2"
                  variant={errors.password ? 'error' : 'default'}
                  type="password"
                  placeholder="••••••"
                  {...register('password')}
                  onBlur={() => trigger('password')}
                />

                <p className="pt-3 font-medium text-slate-600 text-xs">
                  Pelo menos 6 caracteres
                </p>
              </div>
            </div>

            {/* Mensagem de erro genérica */}
            {loginFailed && (
              <div className="flex items-center gap-3 pt-6">
                <CircleAlert className="h-4 w-4 text-red-800" />
                <p className=" text-red-800 text-sm">Credenciais inválidas</p>
              </div>
            )}
          </div>

          <div>
            <Button
              className="w-full"
              variant="dark"
              type="submit"
              disabled={!isValid}
            >
              Login
            </Button>

            <Button
              type="button"
              asChild
              className="mt-4 w-full rounded-md bg-slate-200 py-2 text-slate-600"
            >
              <Link href="/register">Criar uma Conta</Link>
            </Button>
          </div>
        </form>
      </div>

      <div className="ml-16 h-[570px] w-60 bg-slate-600" />
    </main>
  )
}
