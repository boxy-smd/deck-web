'use client'

import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, Printer } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'

import { PortfolioDocument } from '@/components/portfolio/document'
import { Button } from '@/components/ui/button'
import { getStudentProfile } from '@/functions/students'

export default function Portfolio() {
  const { username } = useParams<{
    username: string
  }>()

  const router = useRouter()

  const handleGetStudentDetails = useCallback(async () => {
    const details = await getStudentProfile(username)
    return details
  }, [username])

  const { data: student } = useQuery({
    queryKey: ['portfolio', username],
    queryFn: handleGetStudentDetails,
  })

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-slate-50 p-12">
      <header className="flex w-full flex-col items-center justify-center gap-3">
        <h1 className="text-center font-bold text-2xl">
          Portfólio de {student?.name}
        </h1>

        <div className="flex items-center gap-5">
          <Button onClick={() => router.back()}>
            <ChevronLeft className="size-5" /> Cancelar
          </Button>

          {student && (
            <PDFDownloadLink
              document={<PortfolioDocument student={student} />}
              fileName={`${student.name}.pdf`}
            >
              <Button variant="dark">
                Imprimir <Printer className="ml-2 size-5" />
              </Button>
            </PDFDownloadLink>
          )}
        </div>
      </header>

      {student && (
        <PDFViewer className="aspect-[1.414] w-full max-w-[800px]">
          <PortfolioDocument student={student} />
        </PDFViewer>
      )}
    </main>
  )
}
