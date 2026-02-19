'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { type ReactNode, Suspense, useEffect } from 'react'
import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'

interface LayoutProps {
  children: ReactNode
}

export default function ProtectedLayout({ children }: LayoutProps) {
  const router = useRouter()
  const { status } = useSession()
  const { student } = useAuthenticatedStudent()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/')
      return
    }

    if (status === 'authenticated' && student.error && !student.isLoading) {
      router.replace('/')
    }
  }, [status, student.error, student.isLoading, router])

  if (
    status === 'loading' ||
    student.isLoading ||
    (status === 'authenticated' && !student.data && !student.error)
  ) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center bg-deck-bg"
        aria-busy="true"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-deck-border border-t-deck-darkest" />
      </div>
    )
  }

  if (!student.data) {
    return null
  }

  return <Suspense>{children}</Suspense>
}
