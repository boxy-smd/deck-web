'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { FormProvider } from 'react-hook-form'

import { RegisterMailStep } from '@/components/register/register-mail-step'
import { MoreYouRegisterStep } from '@/components/register/register-more-you-step'
import { RegisterNameStep } from '@/components/register/register-name-step'
import { Button } from '@/components/ui/button'
import { useRegister } from '@/hooks/auth/use-register'

export default function Register() {
  const {
    currentStep,
    handleRegister,
    methods,
    goToNextStep,
    goToPreviousStep,
  } = useRegister()

  const isFistStep = currentStep === 1

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="mr-16 h-[570px] w-60 bg-deck-purple-bg" />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleRegister)}>
          {currentStep === 1 && (
            <RegisterMailStep onGoToNextStep={goToNextStep} />
          )}

          {currentStep === 2 && (
            <RegisterNameStep onGoToNextStep={goToNextStep} />
          )}

          {currentStep === 3 && <MoreYouRegisterStep />}

          {currentStep > 1 && (
            <Button
              onClick={goToPreviousStep}
              className="absolute top-5 left-5 rounded-full text-slate-700 hover:bg-slate-200"
              variant="transparent"
              size="icon"
            >
              <ChevronLeft size={24} />
            </Button>
          )}

          {isFistStep && (
            <Button
              asChild
              onClick={goToPreviousStep}
              className="absolute top-5 left-5 rounded-full text-slate-700 hover:bg-slate-200"
              variant="transparent"
              size="icon"
            >
              <Link href="/login">
                <ChevronLeft size={24} />
              </Link>
            </Button>
          )}
        </form>
      </FormProvider>

      <div className="mr-16 h-[570px] w-60 bg-deck-purple-bg" />
    </main>
  )
}
