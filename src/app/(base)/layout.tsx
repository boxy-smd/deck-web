import { Header } from '@/components/base/header'
import type { ReactNode } from 'react'

interface BaseLayoutProps {
  children: ReactNode
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center bg-slate-50">
      <Header />

      <main className="flex w-screen flex-grow flex-col items-center">
        {children}
      </main>
    </div>
  )
}
