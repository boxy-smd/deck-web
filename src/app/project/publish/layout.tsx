'use client'

import { useRouter } from 'next/navigation'
import { type ReactNode, Suspense } from 'react'
import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'

interface LayoutProps {
  children: ReactNode
}

export default function ProtectedLayout({ children }: LayoutProps) {
  const router = useRouter()

  const { student } = useAuthenticatedStudent()

  if (!student.data) {
    router.push('/')
  }

  return <Suspense>{children}</Suspense>
}
