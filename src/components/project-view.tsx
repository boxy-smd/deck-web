import {} from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Ellipsis,
  Flag,
  Image,
  SendHorizontal,
  Trash,
  User2,
} from 'lucide-react'

interface Comment {
  userHandle: string
  content: string
}

interface ProjectPageProps {
  userName: string
  userHandle: string
  projectTitle: string
  projectDescription: string
  tags: string[]
  course: string
  semester: string
  year: string
  teacher: string
  introduction: string
  objective: string
  expectedResults: string
  conclusion: string
  comments?: Comment[] // Propriedade comments agora é opcional
}

export default function ProjectView({
  userName,
  userHandle,
  projectTitle,
  projectDescription,
  tags,
  course,
  semester,
  year,
  teacher,
  introduction,
  objective,
  expectedResults,
  conclusion,
  comments = [], // Define valor padrão como lista vazia caso não seja passado
}: ProjectPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center py-20">
      <header className="flex w-[860px] items-center justify-between ">
        <div className="flex items-center gap-6 ">
          <div className="flex size-14 justify-items-center rounded-full bg-slate-300">
            <User2 className="z-10 m-auto block size-8 text-slate-700" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 text-xl">{userName}</h1>
            <p className="text-base text-slate-700">@{userHandle}</p>
          </div>
        </div>
        <div>
          <Button>
            <span className="text-slate-900">Excluir Projeto</span>
          </Button>
        </div>
      </header>

      <div className="w-[860px] pt-10">
        <div>
          <div className="h-[300px] w-[860px] bg-slate-600" />

          <h1 className="pt-6 font-semibold text-[32px] text-slate-700">
            {projectTitle}
          </h1>

          <div className="flex gap-3 pt-6">
            {tags.map((tag, index) => (
              <Badge
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                className="group h-[27px] gap-2 truncate rounded-[18px] bg-slate-200 px-3 py-[6px] text-slate-900 text-xs hover:bg-slate-900 hover:text-slate-50"
              >
                <Image className="size-4 text-slate-900 group-hover:text-slate-50" />
                {tag}
              </Badge>
            ))}
          </div>

          <div className="gap-4 pt-6">
            <Badge className="h-[27px] gap-2 truncate rounded-[18px] bg-slate-200 px-3 py-[6px] text-slate-900 text-xs hover:text-slate-50">
              {course}
            </Badge>

            <Badge className="mx-4 h-[27px] gap-2 rounded-[18px] bg-slate-200 px-3 py-[6px] text-slate-900 text-xs hover:text-slate-50">
              {semester}
            </Badge>

            <Badge className="h-[27px] gap-2 rounded-[18px] bg-slate-200 px-3 py-[6px] text-slate-900 text-xs hover:text-slate-50">
              {year}
            </Badge>
          </div>

          <p className="pt-6 pl-[6px]">{projectDescription}</p>

          <div className="gap-4 pt-6">
            <Badge className="h-[27px] gap-2 truncate rounded-[18px] bg-slate-200 px-3 py-[6px] text-slate-900 text-xs hover:text-slate-50">
              {teacher}
            </Badge>
          </div>
        </div>

        <div className="pt-11">
          <div>
            <h1 className="font-semibold text-2xl text-slate-700">
              Introdução
            </h1>
            <p className="pt-3 text-base text-slate-700">{introduction}</p>

            <h1 className="pt-3 font-semibold text-2xl text-slate-700">
              Objetivo
            </h1>
            <p className="pt-3 text-base text-slate-700">{objective}</p>
          </div>

          <div className="my-[30px] h-[184px] w-full bg-slate-700" />

          <div>
            <h1 className="pt-3 font-semibold text-2xl text-slate-700">
              Resultados Esperados
            </h1>
            <p className="pt-3 text-base text-slate-700">{expectedResults}</p>

            <h1 className="pt-3 font-semibold text-2xl text-slate-700">
              Conclusão
            </h1>
            <p className="pt-3 text-base text-slate-700">{conclusion}</p>
          </div>
        </div>
      </div>

      <div className="mt-14 w-[860px] rounded-xl bg-slate-100 p-6">
        <div className="flex items-center gap-6">
          <div className="flex h-14 min-w-14 items-center justify-center rounded-full bg-slate-300">
            <User2 className="size-8 text-slate-700" />
          </div>

          <Input type="text" placeholder="Adicione um comentário..." />

          <Button className="flex h-10 min-w-10 items-center rounded-full">
            <SendHorizontal size={20} />
          </Button>
        </div>

        {comments.length > 0 &&
          comments.map((comment, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              className="flex items-center justify-between pt-10"
            >
              <div className="flex gap-6">
                <div className="flex h-14 min-w-14 items-center justify-center rounded-full bg-slate-300">
                  <User2 className="size-8 text-slate-700" />
                </div>
                <div className="flex flex-col">
                  <h1 className="font-bold text-slate-700">
                    {comment.userHandle}
                  </h1>
                  <p className="text-slate-500">{comment.content}</p>
                </div>
              </div>
              <Popover>
                <PopoverTrigger className="self-start">
                  <Ellipsis className="h-6 w-6 text-slate-700" />
                </PopoverTrigger>
                <PopoverContent className="w-[172px] gap-5 border-slate-400">
                  <Button className="flex w-full justify-start gap-[6px] bg-transparent px-2 py-2 hover:bg-slate-200">
                    <Flag />
                    <p>Denunciar</p>
                  </Button>
                  <Button className="flex w-full justify-start gap-[6px] bg-transparent px-2 py-2 hover:bg-slate-200">
                    <Trash />
                    <p>Excluir</p>
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          ))}
      </div>
    </main>
  )
}
