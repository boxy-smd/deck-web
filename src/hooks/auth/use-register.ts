'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  useUsersControllerRegister,
  useUsersControllerUploadProfileImage,
} from '@/http/api'

const nameRegex = /^[a-zA-Z\s]+$/

const registerFormSchema = z
  .object({
    email: z
      .email('E-mail inválido')
      .regex(/@alu.ufc.br$/, 'E-mail inválido')
      .min(1, 'E-mail é obrigatório'),
    password: z.string().min(6, 'É necessário pelo menos 6 caracteres'),
    confirmPassword: z.string(),
    profileImage: z.instanceof(File).optional(),
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
    semester: z.coerce.number().int().min(1, 'Semestre é obrigatório'),
    trails: z
      .array(z.string())
      .min(1, 'Pelo menos uma trilha de interesse deve ser selecionada'),
    about: z
      .string()
      .max(200, 'Máximo de 200 caracteres')
      .min(1, 'Sobre é obrigatório'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
  .refine(
    data => nameRegex.test(data.firstName) && nameRegex.test(data.lastName),
    {
      message: 'O nome e sobrenome devem conter apenas letras',
      path: ['lastName'],
    },
  )
  .refine(data => data.semester && data.trails.length > 0 && data.about, {
    message: 'Preencha todos os campos',
    path: ['about'],
  })

export type RegisterFormSchema = z.infer<typeof registerFormSchema>

export function useRegister() {
  const router = useRouter()

  const methods = useForm({
    resolver: zodResolver(registerFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const [currentStep, setCurrentStep] = useState(1)

  function goToNextStep() {
    setCurrentStep(prevStep => prevStep + 1)
  }

  function goToPreviousStep() {
    setCurrentStep(prevStep => (prevStep > 1 ? prevStep - 1 : prevStep))
  }

  const { mutateAsync: registerStudent } = useUsersControllerRegister()
  const { mutateAsync: uploadImage } = useUsersControllerUploadProfileImage()

  // Wrapper mutation for the form state
  const registerMutation = useMutation({
    mutationFn: handleRegister,
  })

  async function handleRegister(data: RegisterFormSchema) {
    try {
      // 1. Register student
      await registerStudent({
        data: {
          name: `${data.firstName} ${data.lastName}`,
          username: data.username,
          email: data.email,
          password: data.password,
          semester: data.semester,
          trailsIds: data.trails,
          about: data.about,
          // profileUrl is optional and not in the form explicitly as a string, usually generated after upload
        },
      })

      // 2. Upload Profile Image if exists
      if (data.profileImage) {
        try {
          // data.profileImage is a File object (instanceof File)
          await uploadImage({
            username: data.username,
            data: {
              file: data.profileImage,
            },
          })
        } catch (error) {
          // If upload fails, we likely still want to proceed or warn?
          // Legacy code just logged it and returned. We'll do same but allow redirect.
          console.error('Failed to upload profile image:', error)
          // Don't return here, proceed to login
        }
      }

      router.push('/login')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'

      console.error(errorMessage)
      // Throwing here so registerMutation.isError becomes true if main registration fails
      throw error
    }
  }

  return {
    methods,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    registerMutation,
  }
}
