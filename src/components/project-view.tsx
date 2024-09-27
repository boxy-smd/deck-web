'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Ellipsis,
  Flag,
  Image,
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
} from 'xt] = useState('')
  const [isDeleteDiaReportDialogOpen] = useState(false)

  const handleGetProject = useCallback(async () => {
    try {
      const project = await getProjectDetails(id)
      return project
    } catch (error) {
      console.error('Failed to get project:', error)
      return undefined
    }
  }, [id])

  const { data: project, error, isLoading } = useQuery({
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
      <div className="w-[860px]">
        {/* Cabeçalho e autor */}
        {isLoading || !project ? (
          <Skeleton className="h-14 w-full" />
        ) : (
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {project.author.profileUrl ? (
                <img
                  src={project.author.profileUrl}
                  alt={`${project.author.name}'s profile`}
                  className="h-14 w-14 rounded-full"
                />
              ) : (
                <User2 className="h-14 w-14 text-slate-700" />
              )}
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  {project.author.name}
                </h1>
                <p className="text-base text-slate-700">@{project.author.username}</p>
              </div>
            </div>
            {student.data?.username === project.author.username && (
              <Button onClick={handleDeleteProject}>
                <span className="text-slate-900">Excluir Projeto</span>
              </Button>' text-xl'
            )}
          </header>
        )}

        {/* Banner */}
        {isLoading || !project ? (
          <Skeleton className="h-[300px] w-full mt-6" />
        ) : (
          <div className="h-[3'ull bg-slate-600"> text-xl'
            <img
              src={project.bannerUrl}
              alt="Banner img"
              className="h-full w-full object-cover"
            />
          </div>
        )}'mt-6 '

        {/* Título e Trilhas */}
        {isLoading || !project ? (
          <Skeleton className="h-8 w-full mt-6" />
        ) : (
          <>
            <h1 className="pt-6 text-3xl font-semibold text-slate-700">
              {project.title}
            </h1>'mt-6 '
            <div className="flex gap-3 pt-6">
              {project.trails.map((tag, index) => (
                <Badge key={index} className="truncate bg-slate-200">
                  <Image class'mt-6 ame="mr-2"'
                  {tag}
                </Badge>
              ))}'font-semibold '
            </div>
          </>
        )}

        {/* Descrição */}
        {isLoading || !project'mt-6 ? ('
          <Skeleton className="h-28 w-full mt-6" />
        ) : (
          <p className="pt'6">{pfont-semibold roject.de'
        )}

        {/* Conteúdo */}
        {isLoading || !project ? (
          <Skeleton className="h-40 w-full mt-6" />
        ) : (
          project.content && ('mt-6 '
            <div
              className="prose prose-slate w-full max-w-none pt-6"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          )
        )}
'mt-6 '
        {/* Comentários */}
        {isLoading || !project'mt-6 ? ('
          [1, 2, 3].map(skeleton => <Skeleton key={skeleton} className="h-12 w-full mt-4" />)
        ) : (
          project.comments?.map((comment, index) => (
            <div key={index} className="mt-10 flex justify-between">
              <div className="flex gap-6">
                {comment.author.profileUrl ? (
                  <img'mt-6 '
                    src={comment.author.profileUrl}
                    alt={comment.author.name}
                    className="h-14 w-14 rounded-full"'mt-4 '
                  />
                ) : (
                  <User2 className="h-14 w-14 text-slate-700" />
                )}
                <div className="flex flex-col">
                  <h1 className="font-bold text-slate-700">{comment.author.username}</h1>
                  <p className="text-slate-500">{comment.content}</p>
                </div>
              </div>'mt-4 '
              <Popover>
                <PopoverTrigger className="self-start">
                  <Ellipsis className="h-6 w-6 text-slate-700" />
                </PopoverTrigger>
                <PopoverContent className="w-44">
                  <Button className="flex w-full justify-start gap-2 bg-transparent hover:bg-slate-200">
                    <Flag />
                    <p>Denunciar</p>
                  </Button>
                  <Button className="flex w-full justify-start gap-2 bg-transparent hover:bg-slate-200">
                    <Trash />
                    <p>Excluir</p>
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
