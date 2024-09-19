import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useLoggedStudent } from '@/contexts/hooks/use-logged-student'

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
  const { setStudentDetails } = useLoggedStudent()

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

  async function handleLogin(data: LoginFormSchema) {
    try {
      const response = await fetch('https://deck-api.onrender.com/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      }).then(async response => {
        if (response.ok) {
          return await response.json()
        }

        const error = await response.json()

        throw new Error(error.message)
      })

      setIsLoginFailed(false)

      localStorage.setItem('token', response.token)

      // Fetch student details and set in context
      const studentDetails = await fetchStudentDetails(response.token)
      setStudentDetails(studentDetails)

      router.push('/')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'

      console.error(errorMessage)
      setIsLoginFailed(true)
    }
  }

  async function fetchStudentDetails(token: string) {
    const response = await fetch(
      'https://deck-api.onrender.com/students/details',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const data = await response.json()
    return data.details
  }

  return {
    isLoginFailed,
    router,
    register,
    handleSubmit,
    errors,
    isValid,
    trigger,
    handleLogin,
  }
}
