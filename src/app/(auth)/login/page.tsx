'use client'

import { Label } from '@radix-ui/react-label'
import { ChevronLeft, CircleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/hooks/auth/use-login'
import Link from 'next/link'

import authWidget from '@/assets/widgets/authWidgets/authWidget.svg'
import loginWidget from '@/assets/widgets/authWidgets/loginWidget.svg'
import Image from 'next/image'

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
    <main className="flex min-h-screen items-center justify-center bg-deck-bg">
      <div className="mr-16 h-[570px] w-60">
        <Image src={authWidget} width={240} height={570} alt="login widget" />
      </div>

      <div className="flex min-h-[610px] w-[420px] flex-col rounded-md border px-8 py-9">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="flex flex-grow flex-col justify-between"
        >
          <div>
            <div>
              <h1 className="font-semibold text-[32px] text-deck-darkest leading-none">
                Login
              </h1>

              <p className="pt-3 text-base text-deck-secondary-text leading-tight">
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
                  placeholder="Insira seu e-mail"
                  {...register('email')}
                  onBlur={() => trigger('email')}
                />
              </div>

              <div className="w-full">
                <Label className="text-deck-secondary-text text-sm leading-none">
                  Senha
                </Label>

                <Input
                  className="mt-2"
                  variant={errors.password ? 'error' : 'default'}
                  type="password"
                  placeholder="Insira sua senha"
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

            <Button type="button" asChild className="mt-4 w-full">
              <Link href="/register">Criar uma Conta</Link>
            </Button>

            <Link
              href="/"
              className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full hover:bg-deck-clear-tone"
            >
              <ChevronLeft size={24} className="text-deck-darkest" />
            </Link>
          </div>
        </form>
      </div>

      <div className="ml-16 min-h-[570px] w-64">
        <Image src={loginWidget} width={257} height={570} alt="login widget" />
      </div>
    </main>
  )
}
