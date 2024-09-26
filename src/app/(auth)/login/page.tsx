'use client'

import { Label } from '@radix-ui/react-label'
import { ChevronLeft, CircleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/hooks/auth/use-login'
import Link from 'next/link'

export default function Login() {
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    trigger,
    isLoginFailed,
    handleLogin,
  } = useLogin()

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="mr-16 h-[570px] w-60 bg-slate-600" />

      <div className="flex min-h-[610px] w-[420px] flex-col rounded-md border px-8 py-9">
        <form
          onSubmit={handleSubmit(handleLogin)}
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

            {isLoginFailed && (
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

            <Link
              href="/"
              className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-200"
            >
              <ChevronLeft size={24} />
            </Link>
          </div>
        </form>
      </div>

      <div className="ml-16 h-[570px] w-60 bg-slate-600" />
    </main>
  )
}
