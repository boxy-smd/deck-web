'use client'

import { useRouter } from 'next/navigation'

import { Package, Search } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export function Header() {
  const router = useRouter()

  return (
    <header className="flex h-20 w-full items-center justify-between bg-slate-50 px-10">
      <div className="flex items-center gap-10">
        <div className="flex gap-2">
          <Package size={28} className="text-slate-600" />
          <h1 className="font-semibold text-2xl text-slate-600">Deck</h1>
        </div>

        <div className="relative flex items-center justify-center">
          <Search size={18} className="absolute left-3 text-slate-500" />

          <Input
            className="w-[642px] pl-[46px]"
            inputSize="md"
            placeholder="Pesquisar"
            type="text"
          />
        </div>
      </div>

      <Button onClick={() => router.push('/login')}>Entrar</Button>
    </header>
  )
}
