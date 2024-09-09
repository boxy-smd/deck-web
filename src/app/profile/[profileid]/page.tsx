'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Package, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const router = useRouter()

  return (
    <>
      <nav className="flex justify-between px-10 py-[22px]">
        <div className="flex gap-10 ">
          <div className="flex gap-2 ">
            <Package size={28} className="text-slate-600" />
            <h1 className="font-semibold text-2xl text-slate-600">Deck</h1>
          </div>
          <div className="relative flex items-center">
            <Search
              size={18}
              className="absolute top-[8.5] left-3 text-slate-500"
            />
            <Input
              className="h-[35px] w-[642px] rounded-md border border-slate-300 bg-slate-100 px-4 py-2 pl-10 text-slate-500"
              placeholder="Pesquisar"
              type="text"
            />
          </div>
        </div>

        <Button
          onClick={() => router.push('/login')}
          className="rounded-md bg-slate-200 px-8 py-2 text-base text-slate-600 hover:bg-slate-600 hover:text-slate-50"
        />
      </nav>
    </>
  )
}
