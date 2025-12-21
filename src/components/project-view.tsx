'use client'

import { Ellipsis, Flag, SendHorizontal, Trash, User2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type ElementType, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'
import {
  getCommentsControllerListProjectCommentsQueryKey,
  getProjectsControllerGetProjectQueryKey,
  useCommentsControllerCommentOnProject,
  useCommentsControllerDeleteComment,
  useCommentsControllerReportComment,
  useProjectsControllerDeleteProject,
  useProjectsControllerGetProject,
} from '@/http/api'
import { queryClient } from '@/lib/tanstack-query/client'
import { cn } from '@/lib/utils'
import { Audiovisual } from './assets/audiovisual'
import { Design } from './assets/design'
import { Games } from './assets/games'
import { SMD } from './assets/smd'
import { Systems } from './assets/systems'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Skeleton } from './ui/skeleton'

const trailsIcons: Record<string, [ElementType, string, string, string]> = {
  Design: [
    Design,
    '#980C0C',
    cn('bg-deck-red-light'),
    cn('text-deck-red-dark'),
  ],
  Sistemas: [
    Systems,
    '#00426E',
    cn('bg-deck-blue-light'),
    cn('text-deck-blue-dark'),
  ],
  Audiovisual: [
    Audiovisual,
    '#8A3500',
    cn('bg-deck-orange-light'),
    cn('text-deck-orange-dark'),
  ],
  Jogos: [
    Games,
    '#007F05',
    cn('bg-deck-green-light'),
    cn('text-deck-green-dark'),
  ],
  SMD: [
    SMD,
    '#7D00B3',
    cn('bg-deck-purple-light'),
    cn('text-deck-purple-dark'),
  ],
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This component is complex by nature
export function ProjectView({ id }: { id: string }) {
  const router = useRouter()

  const { student } = useAuthenticatedStudent()

  const [commentText, setCommentText] = useState('')
  const [reportText, setReportText] = useState('')
  const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] =
    useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)

  const { data: projectData, isLoading } = useProjectsControllerGetProject(id)

  const project = projectData

  const trailTheme =
    project && project.trails.length > 0
      ? project.trails.length > 1
        ? [trailsIcons.SMD[2], trailsIcons.SMD[3]]
        : [
            trailsIcons[project.trails[0].name]?.[2] ?? trailsIcons.SMD[2],
            trailsIcons[project.trails[0].name]?.[3] ?? trailsIcons.SMD[3],
          ]
      : [cn('bg-deck-bg'), cn('text-deck-secondary-text')]

  const deleteProjectMutation = useProjectsControllerDeleteProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [getProjectsControllerGetProjectQueryKey(id)],
        })
      },
    },
  })

  const handleDeleteProject = () => {
    deleteProjectMutation.mutate(
      { projectId: id },
      {
        onSuccess: () => {
          router.push('/')
        },
      },
    )
  }

  const postCommentMutation = useCommentsControllerCommentOnProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [getCommentsControllerListProjectCommentsQueryKey(id)],
        })
        setCommentText('')
      },
    },
  })

  function handleSendComment() {
    if (commentText.trim()) {
      postCommentMutation.mutate({
        projectId: id,
        data: { content: commentText },
      })
    }
  }

  const reportCommentMutation = useCommentsControllerReportComment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [getCommentsControllerListProjectCommentsQueryKey(id)],
        })
      },
    },
  })

  function handleReportComment(commentId: string) {
    reportCommentMutation.mutate({
      commentId,
      data: {
        content: reportText,
        projectId: id,
      },
    })
    setIsReportDialogOpen(false)
  }

  const deleteCommentMutation = useCommentsControllerDeleteComment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [getCommentsControllerListProjectCommentsQueryKey(id)],
        })
      },
    },
  })

  function handleDeleteComment(commentId: string) {
    deleteCommentMutation.mutate({ projectId: id, commentId })
    setIsDeleteDialogOpen(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center py-20">
      {isLoading && !project ? (
        <Skeleton className="h-14 w-[860px]" />
      ) : (
        project && (
          <header className="flex w-[860px] items-center justify-between">
            <Link href={`/profile/${project.author.username}`}>
              <div className="flex items-center gap-6">
                <div className="flex size-14 justify-items-center rounded-full bg-slate-300">
                  {project.author.profileUrl ? (
                    <Image
                      src={project.author.profileUrl}
                      alt={`${project.author.name}'s profile`}
                      className="aspect-square size-14 rounded-full"
                      width={28}
                      height={28}
                    />
                  ) : (
                    <User2 className="m-auto size-8 text-slate-700" />
                  )}
                </div>

                <div>
                  <h1 className="font-semibold text-slate-900 text-xl">
                    {project.author.name}
                  </h1>

                  <p className="text-base text-slate-700">
                    @{project?.author.username}
                  </p>
                </div>
              </div>
            </Link>

            <div>
              {student.data?.username === project.author.username && (
                <Dialog open={isDeleteProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsDeleteProjectDialogOpen(true)}>
                      <span className="text-slate-900">Excluir Projeto</span>
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Excluir Projeto</DialogTitle>
                      <DialogDescription>
                        Tem certeza de que deseja excluir permanentemente esse
                        projeto?
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                      <Button
                        onClick={() => setIsDeleteProjectDialogOpen(false)}
                        type="button"
                        size="sm"
                      >
                        Cancelar
                      </Button>

                      <Button
                        onClick={handleDeleteProject}
                        disabled={deleteProjectMutation.isPending}
                        variant="dark"
                        size="sm"
                      >
                        Excluir
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </header>
        )
      )}

      <div className="w-[860px] pt-10">
        <div>
          {isLoading || !project ? (
            <Skeleton className="mt-6 h-[300px] w-[860px]" />
          ) : (
            <div className="h-[300px] w-[860px] bg-slate-600">
              <Image
                src={project?.bannerUrl || ''}
                alt="Banner img"
                className="h-full w-full object-cover"
                width={860}
                height={300}
                unoptimized
              />
            </div>
          )}

          {isLoading || !project ? (
            <Skeleton className="mt-6 h-8 w-full" />
          ) : (
            <>
              <h1 className="pt-6 font-semibold text-[32px] text-slate-700">
                {project?.title}
              </h1>

              <div className="flex gap-3 pt-6">
                {project?.trails.map(trail => {
                  const [Icon, color, bgColor, textColor] =
                    trailsIcons[trail.name] || trailsIcons.SMD
                  const [_, SMDColor, SMDBgColor, SMDTextColor] =
                    trailsIcons.SMD

                  return (
                    <Badge
                      key={trail.id}
                      className={cn(
                        'group h-[27px] gap-2 truncate rounded-[18px] px-3 py-[6px] text-xs',
                        (project?.trails.length ?? 0) > 1
                          ? SMDBgColor
                          : bgColor,
                        (project?.trails.length ?? 0) > 1
                          ? SMDTextColor
                          : textColor,
                      )}
                    >
                      <Icon
                        className="size-[18px]"
                        innerColor={
                          (project?.trails.length ?? 0) > 1 ? SMDColor : color
                        }
                        foregroundColor="transparent"
                      />

                      {trail.name}
                    </Badge>
                  )
                })}
              </div>
            </>
          )}

          {project?.subject && project?.semester && project?.publishedYear && (
            <div className="flex items-center gap-4 pt-6">
              {project?.subject && (
                <Badge className={cn(trailTheme[0], trailTheme[1])}>
                  {project?.subject.name}
                </Badge>
              )}

              {project?.semester && (
                <Badge className={cn(trailTheme[0], trailTheme[1])}>
                  {project?.semester}º Semestre
                </Badge>
              )}

              {project?.publishedYear && (
                <Badge className={cn(trailTheme[0], trailTheme[1])}>
                  {project?.publishedYear}
                </Badge>
              )}
            </div>
          )}

          {isLoading || !project ? (
            <Skeleton className="mt-6 h-28 w-full" />
          ) : (
            <p className="pt-6 pl-[6px]">{project.description}</p>
          )}

          {project?.professors && project?.professors.length > 0 && (
            <div className="flex items-center gap-4 pt-6">
              {project?.professors.map(professor => (
                <Badge
                  key={professor.id}
                  className={cn(trailTheme[0], trailTheme[1])}
                >
                  {professor.name}
                </Badge>
              ))}
            </div>
          )}

          {isLoading || !project ? (
            <Skeleton className="mt-6 h-40 w-full" />
          ) : (
            project.content && (
              <div className="w-full py-11">
                <div
                  className="prose prose-slate w-full max-w-none pt-6 text-slate-700 leading-5"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Isso é seguro
                  dangerouslySetInnerHTML={{ __html: project?.content }}
                />
              </div>
            )
          )}

          {student.data && project?.allowComments && (
            <div className="mt-14 w-[860px] rounded-xl bg-slate-100 p-6">
              <div className="flex items-center gap-6">
                {student.data.profileUrl ? (
                  <Image
                    src={student.data.profileUrl}
                    alt={student.data.name}
                    className="h-14 min-w-14 rounded-full"
                    width={56}
                    height={56}
                  />
                ) : (
                  <div className="flex h-14 min-w-14 items-center justify-center rounded-full bg-slate-300">
                    <User2 className="size-8 text-slate-700" />
                  </div>
                )}

                <Input
                  type="text"
                  placeholder="Adicione um comentário..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                />

                <Button
                  onClick={handleSendComment}
                  className="flex items-center rounded-full"
                  disabled={
                    !commentText.trim() || postCommentMutation.isPending
                  }
                  variant={commentText.trim() ? 'dark' : 'default'}
                  size="icon"
                >
                  <SendHorizontal size={20} />
                </Button>
              </div>

              {isLoading || !project
                ? [1, 2, 3].map(skeleton => (
                    <Skeleton key={skeleton} className="mt-4 h-12 w-full" />
                  ))
                : project.comments?.length > 0 &&
                  project.comments.map(comment => (
                    <div
                      key={comment.id}
                      className="flex items-center justify-between pt-10"
                    >
                      <div className="flex gap-6">
                        {comment.author.profileUrl ? (
                          <Image
                            src={comment.author.profileUrl || ''}
                            alt={comment.author.name}
                            className="size-14 rounded-full"
                            width={28}
                            height={28}
                            unoptimized
                          />
                        ) : (
                          <div className="flex size-14 items-center justify-center rounded-full bg-slate-300">
                            <User2 className="size-8 text-slate-700" />
                          </div>
                        )}

                        <div className="flex flex-col">
                          <h1 className="font-bold text-slate-700">
                            {comment.author.username}
                          </h1>

                          <p className="text-slate-500">{comment.content}</p>
                        </div>
                      </div>

                      <Popover>
                        <PopoverTrigger className="self-start">
                          <Ellipsis className="h-6 w-6 text-slate-700" />
                        </PopoverTrigger>

                        <PopoverContent className="w-[172px] gap-5 border-slate-400 bg-deck-bg text-deck-darkest">
                          <Dialog open={isReportDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => setIsReportDialogOpen(true)}
                                className="flex w-full justify-start gap-[6px] bg-transparent px-3 py-2 text-sm hover:bg-deck-bg-hover"
                              >
                                <Flag className="size-[18px]" />
                                Denunciar
                              </Button>
                            </DialogTrigger>

                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Denunciar Comentário</DialogTitle>
                                <DialogDescription>
                                  Tem certeza de que deseja denunciar esse
                                  comentário?
                                </DialogDescription>
                              </DialogHeader>

                              <Input
                                type="text"
                                placeholder="Escreva sua denúncia"
                                value={reportText}
                                onChange={e => setReportText(e.target.value)}
                              />

                              <DialogFooter>
                                <Button
                                  onClick={() => setIsReportDialogOpen(false)}
                                  type="button"
                                  size="sm"
                                >
                                  Cancelar
                                </Button>

                                <Button
                                  onClick={() =>
                                    handleReportComment(comment.id)
                                  }
                                  disabled={
                                    !reportText.trim() ||
                                    reportCommentMutation.isPending
                                  }
                                  variant="dark"
                                  size="sm"
                                >
                                  Denunciar
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {(student.data?.username ===
                            comment.author.username ||
                            student.data?.username ===
                              project.author.username) && (
                            <Dialog open={isDeleteDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => setIsDeleteDialogOpen(true)}
                                  className="flex w-full justify-start gap-[6px] bg-transparent px-3 py-2 text-sm hover:bg-slate-200"
                                >
                                  <Trash className="size-[18px]" />
                                  Excluir
                                </Button>
                              </DialogTrigger>

                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Excluir Comentário</DialogTitle>
                                  <DialogDescription>
                                    Tem certeza de que deseja excluir
                                    permanentemente esse comentário?
                                  </DialogDescription>
                                </DialogHeader>

                                <DialogFooter>
                                  <Button
                                    onClick={() => setIsDeleteDialogOpen(false)}
                                    type="button"
                                    size="sm"
                                  >
                                    Cancelar
                                  </Button>

                                  <Button
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    disabled={deleteCommentMutation.isPending}
                                    variant="dark"
                                    size="sm"
                                  >
                                    Excluir
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </PopoverContent>
                      </Popover>
                    </div>
                  ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
