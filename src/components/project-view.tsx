'use client'

import { Ellipsis, Flag, SendHorizontal, Trash, User2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'
import {
  getProjectsControllerFetchPostsQueryKey,
  getProjectsControllerGetProjectQueryKey,
  useCommentsControllerCommentOnProject,
  useCommentsControllerDeleteComment,
  useCommentsControllerReportComment,
  useProjectsControllerDeleteProject,
  useProjectsControllerGetProject,
} from '@/http/api'
import { queryClient } from '@/lib/tanstack-query/client'
import { getMultiTrailConfig, getTrailConfig } from '@/lib/trails-config'
import { cn } from '@/lib/utils'
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
import { InlineErrorNotice } from './ui/inline-error-notice'
import { Skeleton } from './ui/skeleton'

type CachedProject = {
  comments?: Array<{
    id: string
    content: string
    createdAt: string
    author: {
      id: string
      name: string
      username: string
      profileUrl?: string
    }
  }>
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This component is complex by nature
export function ProjectView({ id }: { id: string }) {
  const router = useRouter()

  const { student } = useAuthenticatedStudent()

  const [commentText, setCommentText] = useState('')
  const [reportText, setReportText] = useState('')
  const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] =
    useState(false)
  const [openDeleteCommentId, setOpenDeleteCommentId] = useState<string | null>(
    null,
  )
  const [openReportCommentId, setOpenReportCommentId] = useState<string | null>(
    null,
  )
  const [actionError, setActionError] = useState<string | null>(null)

  const { data: projectData, isLoading } = useProjectsControllerGetProject(id, {
    query: {
      networkMode: 'online',
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  })

  const project = projectData
  const projectQueryKey = getProjectsControllerGetProjectQueryKey(id)

  function getNetworkErrorMessage(fallback: string) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return 'Sem conexão. Verifique sua internet e tente novamente.'
    }

    return fallback
  }

  const multiTrailConfig = getMultiTrailConfig()
  const trailTheme =
    project && project.trails.length > 0
      ? project.trails.length > 1
        ? [multiTrailConfig.bgColor, multiTrailConfig.textColor]
        : (() => {
            const config = getTrailConfig(
              project.trails[0].name,
              project.trails[0],
            )
            return [config.bgColor, config.textColor]
          })()
      : [cn('bg-deck-bg'), cn('text-deck-secondary-text')]

  const deleteProjectMutation = useProjectsControllerDeleteProject({
    mutation: {
      networkMode: 'online',
      retry: 0,
      onMutate: () => {
        setActionError(null)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: projectQueryKey,
        })
      },
      onError: () => {
        setActionError(
          getNetworkErrorMessage('Não foi possível excluir o projeto.'),
        )
      },
    },
  })

  const handleDeleteProject = () => {
    deleteProjectMutation.mutate(
      { projectId: id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getProjectsControllerFetchPostsQueryKey(),
          })
          queryClient.invalidateQueries({
            queryKey: ['/posts/search'],
          })
          router.push('/')
        },
      },
    )
  }

  const postCommentMutation = useCommentsControllerCommentOnProject({
    mutation: {
      networkMode: 'online',
      retry: 0,
      onMutate: async variables => {
        setActionError(null)
        await queryClient.cancelQueries({ queryKey: projectQueryKey })

        const previousProject =
          queryClient.getQueryData<CachedProject>(projectQueryKey)
        const content = variables.data.content?.trim()

        if (previousProject && content && student.data) {
          const currentStudent = student.data

          queryClient.setQueryData<CachedProject | undefined>(
            projectQueryKey,
            current => {
            if (!current) {
              return current
            }

            const optimisticComment = {
              id: `temp-${Date.now()}`,
              content,
              createdAt: new Date().toISOString(),
              author: {
                id: currentStudent.id,
                name: currentStudent.name,
                username: currentStudent.username,
                profileUrl: currentStudent.profileUrl,
              },
            }

            return {
              ...current,
              comments: [...(current.comments || []), optimisticComment],
            }
            },
          )
        }

        return { previousProject }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: projectQueryKey,
        })
        setCommentText('')
      },
      onError: (_error, _variables, context) => {
        if (context?.previousProject) {
          queryClient.setQueryData(projectQueryKey, context.previousProject)
        }
        setActionError(
          getNetworkErrorMessage('Não foi possível enviar o comentário.'),
        )
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
      networkMode: 'online',
      retry: 0,
      onMutate: () => {
        setActionError(null)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: projectQueryKey,
        })
      },
      onError: () => {
        setActionError(
          getNetworkErrorMessage('Não foi possível enviar a denúncia.'),
        )
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
    setOpenReportCommentId(null)
    setReportText('')
  }

  const deleteCommentMutation = useCommentsControllerDeleteComment({
    mutation: {
      networkMode: 'online',
      retry: 0,
      onMutate: async variables => {
        setActionError(null)
        await queryClient.cancelQueries({ queryKey: projectQueryKey })
        const previousProject =
          queryClient.getQueryData<CachedProject>(projectQueryKey)

        queryClient.setQueryData<CachedProject | undefined>(
          projectQueryKey,
          current => {
            if (!current) {
              return current
            }

            return {
              ...current,
              comments: (current.comments || []).filter(
                comment => comment.id !== variables.commentId,
              ),
            }
          },
        )

        return { previousProject }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: projectQueryKey,
        })
      },
      onError: (_error, _variables, context) => {
        if (context?.previousProject) {
          queryClient.setQueryData(projectQueryKey, context.previousProject)
        }
        setActionError(
          getNetworkErrorMessage('Não foi possível excluir o comentário.'),
        )
      },
    },
  })

  function handleDeleteComment(commentId: string) {
    deleteCommentMutation.mutate({ projectId: id, commentId })
    setOpenDeleteCommentId(null)
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-3 py-4 md:py-6 lg:px-0 lg:py-20">
      {isLoading && !project ? (
        <Skeleton className="h-14 w-full max-w-[860px]" />
      ) : (
        project && (
          <header className="flex w-full max-w-[860px] flex-wrap items-center justify-between gap-4">
            <Link href={`/profile/${project.author.username}`}>
              <div className="flex min-w-0 items-center gap-4 lg:gap-6">
                <div className="flex size-14 justify-items-center rounded-full bg-slate-300">
                  {project.author.profileUrl ? (
                    <Image
                      src={project.author.profileUrl}
                      alt={`${project.author.name}'s profile`}
                      className="aspect-square size-14 rounded-full"
                      width={56}
                      height={56}
                    />
                  ) : (
                    <User2 className="m-auto size-8 text-slate-700" />
                  )}
                </div>

                <div className="min-w-0">
                  <h1 className="truncate font-semibold text-lg text-slate-900 md:text-xl">
                    {project.author.name}
                  </h1>

                  <p className="truncate text-slate-700 text-sm md:text-base">
                    @{project?.author.username}
                  </p>
                </div>
              </div>
            </Link>

            <div>
              {student.data?.username === project.author.username && (
                <Dialog open={isDeleteProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      onClick={() => setIsDeleteProjectDialogOpen(true)}
                      size="sm"
                    >
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
                        type="button"
                      >
                        {deleteProjectMutation.isPending
                          ? 'Excluindo...'
                          : 'Excluir'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </header>
        )
      )}

      <div className="w-full max-w-[860px] pt-4 md:pt-6 lg:pt-10">
        <div>
          {isLoading || !project ? (
            <Skeleton className="mt-6 h-[200px] w-full lg:h-[300px]" />
          ) : (
            <div className="h-[200px] w-full bg-slate-600 lg:h-[300px]">
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
              <h1 className="pt-5 font-semibold text-2xl text-slate-700 md:pt-6 md:text-[32px]">
                {project?.title}
              </h1>

              <div className="flex flex-wrap gap-2.5 pt-4 md:gap-3 md:pt-6">
                {project?.trails.map(trail => {
                  const isMultiTrail = (project?.trails.length ?? 0) > 1
                  const config = isMultiTrail
                    ? multiTrailConfig
                    : getTrailConfig(trail.name, trail)
                  const { icon: Icon, color, bgColor, textColor } = config

                  return (
                    <Badge
                      key={trail.id}
                      className={cn(
                        'group h-[27px] gap-2 truncate rounded-[18px] px-3 py-[6px] text-xs',
                        bgColor,
                        textColor,
                      )}
                    >
                      <Icon
                        className="size-[18px]"
                        innerColor={color}
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
            <div className="flex flex-wrap items-center gap-3 pt-6 lg:gap-4">
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
            <p className="pt-4 md:pt-6">{project.description}</p>
          )}

          {project?.professors && project?.professors.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5 pt-4 md:gap-4 md:pt-6">
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
              <div className="w-full py-8 md:py-11">
                <div
                  className="rich-text-content rich-text-content--post w-full max-w-none pt-6 text-deck-secondary-text leading-5"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: Isso é seguro
                  dangerouslySetInnerHTML={{ __html: project?.content }}
                />
              </div>
            )
          )}

          {student.data && project?.allowComments && (
            <div className="mt-14 w-full rounded-xl bg-slate-100 p-4 lg:p-6">
              <div className="sr-only" aria-live="polite">
                {postCommentMutation.isPending
                  ? 'Enviando comentário...'
                  : reportCommentMutation.isPending
                    ? 'Enviando denúncia...'
                    : deleteCommentMutation.isPending
                      ? 'Excluindo comentário...'
                  : ''}
              </div>
              {actionError && (
                <InlineErrorNotice
                  message={actionError}
                  onDismiss={() => setActionError(null)}
                  className="mb-4"
                  textSize="sm"
                />
              )}

              <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap lg:gap-6">
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
                  className="min-w-[180px] flex-1"
                />

                <Button
                  type="button"
                  onClick={handleSendComment}
                  className="flex items-center rounded-full"
                  disabled={
                    !commentText.trim() || postCommentMutation.isPending
                  }
                  variant={commentText.trim() ? 'dark' : 'default'}
                  size="icon"
                  aria-label={
                    postCommentMutation.isPending
                      ? 'Enviando comentário'
                      : 'Enviar comentário'
                  }
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
                    <div key={comment.id} className="flex items-start justify-between gap-3 pt-8 md:pt-10">
                      <div className="flex min-w-0 gap-4 md:gap-6">
                        {comment.author.profileUrl ? (
                          <Image
                            src={comment.author.profileUrl || ''}
                            alt={comment.author.name}
                            className="size-12 rounded-full md:size-14"
                            width={56}
                            height={56}
                          />
                        ) : (
                          <div className="flex size-12 items-center justify-center rounded-full bg-slate-300 md:size-14">
                            <User2 className="size-7 text-slate-700 md:size-8" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h1 className="truncate font-bold text-slate-700">
                            {comment.author.username}
                          </h1>

                          <p className="break-words text-slate-500">{comment.content}</p>
                        </div>
                      </div>

                      <Popover>
                        <PopoverTrigger className="self-start rounded-full p-1 hover:bg-slate-100">
                          <Ellipsis className="h-6 w-6 text-slate-700" />
                        </PopoverTrigger>

                        <PopoverContent className="w-[min(200px,80vw)] gap-5 border-slate-400 bg-deck-bg text-deck-darkest">
                          <Dialog
                            open={openReportCommentId === comment.id}
                            onOpenChange={open => {
                              setOpenReportCommentId(open ? comment.id : null)
                              if (!open) {
                                setReportText('')
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => setOpenReportCommentId(comment.id)}
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
                                  onClick={() => {
                                    setOpenReportCommentId(null)
                                    setReportText('')
                                  }}
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
                                  type="button"
                                >
                                  {reportCommentMutation.isPending
                                    ? 'Enviando...'
                                    : 'Denunciar'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {(student.data?.username ===
                            comment.author.username ||
                            student.data?.username ===
                              project.author.username) && (
                            <Dialog
                              open={openDeleteCommentId === comment.id}
                              onOpenChange={open =>
                                setOpenDeleteCommentId(open ? comment.id : null)
                              }
                            >
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => setOpenDeleteCommentId(comment.id)}
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
                                    onClick={() => setOpenDeleteCommentId(null)}
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
                                    type="button"
                                  >
                                    {deleteCommentMutation.isPending
                                      ? 'Excluindo...'
                                      : 'Excluir'}
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
