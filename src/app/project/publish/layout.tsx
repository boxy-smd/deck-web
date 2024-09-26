'use client'

import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function ProtectedLayout({ children }: LayoutProps) {
  const router = useRouter()

  const { student } = useAuthenticatedStudent()

  if (!student.data) {
    router.push('/')
  }

  return <>{children}</>
}
