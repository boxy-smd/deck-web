import type { ReactNode } from 'react'

import { Header } from '@/components/base/header'

interface BaseLayoutProps {
  children: ReactNode
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}
