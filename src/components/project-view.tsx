'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Ellipsis,
  Flag,
  Image,
  SendHorizontal,
  Trash,
  User2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuthenticatedStudent } from '@/contexts/hooks/use-authenticated-student'
import { deleteProject, getProjectDetails } from '@/functions/projects'
import { instance } from '@/lib/axios'
import { queryClient } from '@/lib/tanstack-query/client'
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

export default function ProjectView({ id }: { id: string }) {
  const router = useRouter()

  const { student } = useAuthenticatedStudent()

  const [commentText, setCommentText] = useState('')
  const [reportText, setReportText] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)

  const handleGetProject = useCallback(async () => {
    try {
      const project = await getProjectDetails(id)
      return project
    } catch (error) {
      console.error('Failed to get project:', error)
      return undefined
    }
  }, [id])

  const {
    data: project,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['project', id],
    queryFn: handleGetProject,
  })

  const deleteProjectMutation = useMutation<void, Error, string>({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
    },
  })

  const handleDeleteProject = () => {
    deleteProjectMutation.mutate(id, {
      onSuccess: () => {
        router.push('/')
      },
    })
  }

  const postComment = useMutation<void, Error, string>({
    mutationFn: async (content: string) => {
      await instance.post(`/projects/${id}/comments`, {
        content,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      setCommentText('')
    },
  })

  function handleSendComment() {
    if (commentText.trim()) {
      postComment.mutate(commentText)
    }
  }

  const reportComment = useMutation<void, Error, string>({
    mutationFn: async (commentId: string) => {
      await instance.post(`/reports/${commentId}`, {
        content: reportText,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
    },
  })

  function handleReportComment(commentId: string) {
    reportComment.mutate(commentId)
    setIsReportDialogOpen(false)
  }

  const deleteComment = useMutation<void, Error, string>({
    mutationFn: async (commentId: string) => {
      await instance.delete(`/projects/${id}/comments/${commentId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
    },
  })

  function handleDeleteComment(commentId: string) {
    deleteComment.mutate(commentId)
    setIsDeleteDialogOpen(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center py-20">
      {isLoading && <p>Carregando...</p>}
      {error && <p>Erro ao carregar o projeto: {error.message}</p>}
      {project && (
        <>
          <header className="flex w-[860px] items-center justify-between ">
            <div className="flex items-center gap-6 ">
              <div className="flex size-14 justify-items-center rounded-full bg-slate-300">
                {project.author.profileUrl ? (
                  <img
                    src={project.author.profileUrl}
                    alt={`${project.author.name}'s profile`}
                    className="size-14 rounded-full"
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
            <div>
              {student.data?.username === project.author.username && (
                <Button onClick={handleDeleteProject}>
                  <span className="text-slate-900">Excluir Projeto</span>
                </Button>
              )}
            </div>
          </header>

          <div className="w-[860px] pt-10">
            <div>
              <div className="h-[300px] w-[860px] bg-slate-600">
                <img
                  src={project?.bannerUrl}
                  alt="Banner img"
                  className="h-full w-full object-cover"
                />
              </div>

              <h1 className="pt-6 font-semibold text-[32px] text-slate-700">
                {project?.title}
              </h1>

              <div className="flex gap-3 pt-6">
                {project?.trails.map(tag => (
                  <Badge
                    key={tag}
                    className="group h-[27px] gap-2 truncate rounded-[18px] bg-slate-200 px-3 py-[6px] text-slate-900 text-xs"
                  >
                    <Image className="size-4 text-slate-900 group-hover:text-slate-50" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="pt-6 pl-[6px]">{project?.description}</p>

              {project?.content && (
                <div className="w-full py-11">
                  <div
                    className="prose prose-slate w-full max-w-none pt-6 text-slate-700 leading-5"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                    dangerouslySetInnerHTML={{ __html: project?.content }}
                  />
                </div>
              )}

              <div className="mt-14 w-[860px] rounded-xl bg-slate-100 p-6">
                <div className="flex items-center gap-6">
                  {student.data?.profileUrl ? (
                    <img
                      src={student.data?.profileUrl}
                      alt={student.data?.name}
                      className="h-14 min-w-14 rounded-full"
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
                    size="icon"
                    className="flex items-center rounded-full"
                    onClick={handleSendComment}
                  >
                    <SendHorizontal size={20} />
                  </Button>
                </div>

                {project.comments?.length > 0 &&
                  project.comments.map(comment => (
                    <div
                      key={comment.id}
                      className="flex items-center justify-between pt-10"
                    >
                      <div className="flex gap-6">
                        {comment.author.profileUrl ? (
                          <img
                            src={comment.author.profileUrl}
                            alt={comment.author.name}
                            className="h-14 min-w-14 rounded-full"
                          />
                        ) : (
                          <div className="flex h-14 min-w-14 items-center justify-center rounded-full bg-slate-300">
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
                                  variant="dark"
                                  size="sm"
                                >
                                  Denunciar
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {student.data?.username ===
                            comment.author.username && (
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
                                  <DialogTitle>Excluir Projeto</DialogTitle>
                                  <DialogDescription>
                                    Tem certeza de que deseja excluir
                                    permanentemente esse projeto?
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
            </div>
          </div>
        </>
      )}
    </main>
  )
}
