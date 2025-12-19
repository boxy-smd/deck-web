import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'

import { QueryProvider } from '@/lib/tanstack-query/query-provider'
import { GlobalStateSync } from '@/providers/global-state-sync'
import { NextAuthSessionProvider } from '@/providers/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Deck',
  description:
    'Conheça o repositório de trabalhos acadêmicos multidisciplinares do curso de Sistemas e Mídias Digitais',
  authors: [
    {
      name: 'Amanda Coelho',
      url: 'http://linkedIn.com/in/amandaco3lho/',
    },
    {
      name: 'David Silva',
      url: 'https://github.com/davsilvam',
    },
    {
      name: 'Gabriel Sousa',
      url: '',
    },
    {
      name: 'Guilherme Bessa',
      url: 'https://github.com/Guiezz',
    },
    {
      name: 'Levi Ribeiro',
      url: 'https://github.com/ribeiroLevi',
    },
    {
      name: 'Márcio Freires',
      url: 'https://github.com/Siriusz1',
    },
  ],
  creator: 'Deck Team',
  keywords: [
    'deck',
    'trabalhos acadêmicos',
    'sistemas e mídias digitais',
    'repositório',
    'multidisciplinar',
    'universidade federal do ceará',
    'ufc',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        <NuqsAdapter>
          <QueryProvider>
            <NextAuthSessionProvider>
              <GlobalStateSync>{children}</GlobalStateSync>
            </NextAuthSessionProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
