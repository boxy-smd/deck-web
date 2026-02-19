'use client'

import {
  ChevronRight,
  FileText,
  Home,
  LogIn,
  LogOut,
  Menu,
  PenSquare,
  User2,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Suspense } from 'react'
import Logo from '@/assets/logo.svg'
import { SearchInputWithFilters } from '@/components/filter/search-input-with-filters'
import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { ProfileImage } from './profile-image'

export function Header() {
  const { student } = useAuthenticatedStudent()
  const pathname = usePathname()
  const isProjectDetailsPage = /^\/projects\/[^/]+$/.test(pathname)

  async function handleSignOut() {
    await signOut()
  }

  if (isProjectDetailsPage) {
    return null
  }

  return (
    <header className="flex w-full flex-col border-deck-border border-b bg-deck-bg px-3 py-3 md:h-20 md:flex-row md:items-center md:justify-between md:border-b-0 md:px-10 md:py-0">
      <div className="flex w-full items-center justify-between md:w-auto md:justify-start md:gap-10">
        <div className="flex gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src={Logo} alt="Deck" width={30} height={30} />
            <h1 className="font-semibold text-deck-darkest text-xl md:text-2xl">
              Deck
            </h1>
          </Link>
        </div>

        <div className="hidden md:block">
          <Suspense fallback={null}>
            <SearchInputWithFilters />
          </Suspense>
        </div>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="transparent"
                size="icon"
                className="rounded-lg border border-deck-border"
              >
                <Menu className="size-6 text-deck-darkest" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-[min(22rem,calc(100vw-1.5rem))] rounded-xl border-deck-border p-1.5 shadow-md"
            >
              {student.data ? (
                <>
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex items-center gap-2.5">
                      <ProfileImage
                        src={student.data.profileUrl}
                        alt={student.data.name}
                      />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-semibold text-slate-900 text-sm">
                          {student.data.name}
                        </span>
                        <span className="truncate text-slate-500 text-xs">
                          @{student.data.username}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              ) : null}

              <DropdownMenuItem
                asChild
                className="rounded-md px-3 py-2.5 focus:bg-slate-100"
              >
                <Link href="/" className="flex items-center gap-2.5">
                  <Home size={18} className="text-slate-700" />
                  Início
                </Link>
              </DropdownMenuItem>

              {student.data ? (
                <>
                  <DropdownMenuItem
                    asChild
                    className="rounded-md px-3 py-2.5 focus:bg-slate-100"
                  >
                    <Link
                      href="/projects/publish"
                      className="flex items-center gap-2.5"
                    >
                      <PenSquare size={18} className="text-slate-700" />
                      Publicar Projeto
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    asChild
                    className="rounded-md px-3 py-2.5 focus:bg-slate-100"
                  >
                    <Link
                      href={`/profile/${student.data.username}`}
                      className="flex items-center gap-2.5"
                    >
                      <User2 size={18} className="text-slate-700" />
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <FileText size={16} />
                      <span className="font-medium text-xs uppercase tracking-wide">
                        Seus rascunhos
                      </span>
                    </div>
                  </DropdownMenuLabel>

                  {student.data.drafts.length > 0 ? (
                    <div className="max-h-52 overflow-y-auto">
                      {student.data.drafts.map(project => (
                        <DropdownMenuItem
                          key={project.id}
                          asChild
                          className="rounded-md px-3 py-2.5 focus:bg-slate-100"
                        >
                          <Link
                            href={`/projects/publish?draftId=${project.id}`}
                            className="flex items-start gap-2.5"
                          >
                            <FileText
                              size={16}
                              className="mt-0.5 shrink-0 text-slate-500"
                            />
                            <span className="line-clamp-2 font-medium text-slate-900 text-sm leading-5">
                              {project.title || 'Rascunho sem titulo'}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ) : (
                    <p className="px-3 py-2 text-slate-700 text-sm">
                      Nenhum rascunho encontrado.
                    </p>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="gap-2.5 rounded-md px-3 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700"
                  >
                    <LogOut size={18} className="text-red-600" />
                    Sair
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem
                  asChild
                  className="rounded-md px-3 py-2.5 focus:bg-slate-100"
                >
                  <Link href="/login" className="flex items-center gap-2.5">
                    <LogIn size={18} className="text-slate-700" />
                    Entrar
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-3 w-full md:hidden">
        <Suspense fallback={null}>
          <SearchInputWithFilters />
        </Suspense>
      </div>

      {student.data ? (
        <div className="hidden items-center justify-center gap-5 md:flex">
          <Button variant="dark" asChild>
            <Link href="/projects/publish">Publicar Projeto</Link>
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
                  <ChevronRight size={18} className="ml-1 text-slate-700" />
                  Rascunhos
                </DropdownMenuSubTrigger>

                {student.data?.drafts.length > 0 ? (
                  <DropdownMenuSubContent className="mr-1">
                    {student.data?.drafts.map(project => (
                      <DropdownMenuItem key={project.id} asChild>
                        <Link
                          href={`/projects/publish?draftId=${project.id}`}
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
        <Button variant="dark" asChild className="hidden md:inline-flex">
          <Link href="/login">Entrar</Link>
        </Button>
      )}
    </header>
  )
}
