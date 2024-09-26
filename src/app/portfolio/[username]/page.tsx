'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, Printer } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'

import { PortfolioDocument } from '@/components/portfolio/document'
import { Button } from '@/components/ui/button'
import { getStudentProfile } from '@/functions/students'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'

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
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-slate-50 p-12 print:p-0">
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-200"
      >
        <ChevronLeft size={24} />
      </button>

      <header className="flex w-full flex-col items-center justify-center gap-3">
        <h1 className="text-center font-bold text-2xl">
          Portfólio de {student?.name}
        </h1>

        {student && (
          <PDFDownloadLink
            document={<PortfolioDocument student={student} />}
            fileName={`${student.name}.pdf`}
          >
            <Button variant="dark" className="print:hidden">
              Imprimir <Printer className="ml-2 size-5" />
            </Button>
          </PDFDownloadLink>
        )}
      </header>

      {student && (
        <PDFViewer className="aspect-[1.414] w-full max-w-[800px]">
          <PortfolioDocument student={student} />
        </PDFViewer>
      )}
    </main>
  )
}
