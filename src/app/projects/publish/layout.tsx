'use client'

import { useRouter } from 'next/navigation'
import { type ReactNode, Suspense, useEffect } from 'react'
import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'

interface LayoutProps {
  children: ReactNode
}

export default function ProtectedLayout({ children }: LayoutProps) {
  const router = useRouter()
  const { student } = useAuthenticatedStudent()

  useEffect(() => {
    if (!(student.isLoading || student.data)) {
      router.push('/')
    }
  }, [student.data, student.isLoading, router])

  if (student.isLoading || !student.data) {
    return null // Or a loading spinner
  }

  return <Suspense>{children}</Suspense>
}
