import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginFormSchema = z.object({
  email: z
    .string()
    .email('E-mail inválido')
    .regex(/@alu.ufc.br$/, 'E-mail deve ser institucional')
    .min(1, 'E-mail é obrigatório'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres'),
})

type LoginFormSchema = z.infer<typeof loginFormSchema>

export function useLogin() {
  const router = useRouter()

  const [isLoginFailed, setIsLoginFailed] = useState(false)

  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    trigger,
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
  })

  const loginMutation = useMutation({
    mutationFn: handleLogin,
  })

  async function handleLogin({ email, password }: LoginFormSchema) {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result?.error)
      }

      router.replace('/')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'

      console.error(errorMessage)
      setIsLoginFailed(true)
    }
  }

  return {
    isLoginFailed,
    router,
    register,
    handleSubmit,
    errors,
    isValid,
    trigger,
    loginMutation,
  }
}
