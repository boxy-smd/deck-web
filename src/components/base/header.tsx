'use client'

import { ChevronLeft, LogOut, Package, User2 } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

import { SearchInputWithFilters } from '@/components/filter/search-input-with-filters'
import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { ProfileImage } from './profile-image'

export function Header() {
  const { student } = useAuthenticatedStudent()

  async function handleSignOut() {
    await signOut()
  }

  return (
    <header className="flex h-20 w-full items-center justify-between px-10">
      <Link href="/" className="flex items-center gap-10">
        <div className="flex gap-2">
          <Package size={28} className="text-slate-600" />
          <h1 className="font-semibold text-2xl text-slate-600">Deck</h1>
        </div>

        <SearchInputWithFilters />
      </Link>

      {student.data ? (
        <div className="flex items-center justify-center gap-5">
          <Button asChild>
            <Link href="/project/publish">Publicar Projeto</Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <ProfileImage
                src={student.data?.profileUrl}
                alt={student.data?.name}
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="mt-1 w-44">
              <DropdownMenuItem asChild>
                <Link
                  href={`/profile/${student.data?.username}`}
                  className="flex items-center gap-2"
                >
                  <User2 size={18} className="text-slate-700" />
                  Meu Perfil
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-2">
                  <ChevronLeft size={18} className="ml-1 text-slate-700" />
                  Rascunhos
                </DropdownMenuSubTrigger>

                {student.data?.drafts.length > 0 ? (
                  <DropdownMenuSubContent className="mr-1">
                    {student.data?.drafts.map(project => (
                      <DropdownMenuItem key={project.id} asChild>
                        <Link
                          href={`/project/publish?draftId=${project.id}`}
                          className="flex items-center gap-2"
                        >
                          {project.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                ) : (
                  <DropdownMenuSubContent className="mr-1">
                    <p className="px-4 py-2 text-slate-700 text-sm">
                      Nenhum rascunho encontrado.
                    </p>
                  </DropdownMenuSubContent>
                )}
              </DropdownMenuSub>

              <DropdownMenuItem asChild>
                <Button
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-start gap-2 bg-transparent"
                >
                  <LogOut size={18} className="text-slate-700" />
                  Sair
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button asChild>
          <Link href="/login">Entrar</Link>
        </Button>
      )}
    </header>
  )
}
