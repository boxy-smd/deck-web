'use client'

import { useEffect, useState } from 'react'

import { RegisterMail } from '@/components/register/register-mail'
import { MoreYouRegister } from '@/components/register/register-more-you'
import { RegisterName } from '@/components/register/register-name'

type FormData = {
  email?: string
  password?: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
  username?: string
  semester?: number
  interests?: string[]
  about?: string
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nextStep = () => {
    setCurrentStep(prevStep => prevStep + 1)
  }

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData,
    }))
  }

  const handleFinalSubmit = () => {
    setIsSubmitting(true)
  }

  useEffect(() => {
    if (isSubmitting) {
      console.log('Enviando dados:', formData)
      // Aqui você pode enviar `formData` para o backend
      setIsSubmitting(false)
    }
  }, [isSubmitting, formData])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="mr-16 h-[570px] w-60 bg-slate-600" />

      <div>
        {currentStep === 1 && (
          <RegisterMail nextStep={nextStep} updateFormData={updateFormData} />
        )}

        {currentStep === 2 && (
          <RegisterName nextStep={nextStep} updateFormData={updateFormData} />
        )}

        {currentStep === 3 && (
          <MoreYouRegister
            updateFormData={updateFormData}
            onSubmit={handleFinalSubmit}
          />
        )}
      </div>

      <div className="ml-16 h-[570px] w-60 bg-slate-600" />
    </main>
  )
}
