'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { RegisterMailStep } from '@/components/register/register-mail-step'
import { MoreYouRegisterStep } from '@/components/register/register-more-you-step'
import { RegisterNameStep } from '@/components/register/register-name-step'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const nameRegex = /^[a-zA-Z\s]+$/

const registerFormSchema = z
  .object({
    email: z
      .string()
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

export default function Register() {
  const methods = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const [currentStep, setCurrentStep] = useState(1)

  const nextStep = () => {
    setCurrentStep(prevStep => prevStep + 1)
  }
  const prevStep = () => {
    setCurrentStep(prevStep => (prevStep > 1 ? prevStep - 1 : prevStep))
  }

  function submitForm(data: RegisterFormSchema) {
    console.log(data)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="mr-16 h-[570px] w-60 bg-slate-600" />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submitForm)}>
          {currentStep === 1 && <RegisterMailStep nextStep={nextStep} />}
          {currentStep === 2 && <RegisterNameStep nextStep={nextStep} />}
          {currentStep === 3 && <MoreYouRegisterStep />}

          {currentStep > 1 && (
            <Link
              href=""
              onClick={prevStep}
              className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-200"
            >
              <ChevronLeft size={24} />
            </Link>
          )}
          {currentStep === 1 && (
            <Link
              href="/login"
              className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-200"
            >
              <ChevronLeft size={24} />
            </Link>
          )}
        </form>
      </FormProvider>

      <div className="ml-16 h-[570px] w-60 bg-slate-600" />
    </main>
  )
}
