import { Image } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"


import { Button } from '@/components/ui/button'
import { Modal } from '@/components/profile/modal-profile'

type ProjectCardProps = {
  nickname: string
  author: string
  tags: string[]
  description: string
  semester: string
}


export function ProfileCard({
  nickname,
  author,
  tags,
  description,
  semester,
}: ProjectCardProps) {
  return (
    <div className="relative h-[496px] w-[332px] rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
      <div className="flex h-full w-full flex-col items-start justify-between">
        <div className="relative flex h-[403px] w-[292px] flex-col">
            <div className="flex items-center">
                <div className="h-[72px] w-[72px] bg-slate-600 rounded-full mr-4">
                </div>
                <div>
                    <h1 className="font-semibold text-slate-700 text-xl">
                    {author}
                    </h1>

                    <p className="text-slate-600 text-sm">
                    <HoverCard>
                        <HoverCardTrigger>
                        {nickname} • {semester}
                    </HoverCardTrigger>
                    <HoverCardContent>
                 {tags[1]}
                 </HoverCardContent>
            </HoverCard>
          </p>
                </div>
            </div>


          <div className="pt-7">
        
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} className="h-[27px] max-w-[130px] truncate rounded-[18px] bg-slate-200 px-4 py-[6px] text-slate-900 text-xs hover:text-slate-50">
                    <Image className='w-[18px] h-[18px] mr-1'/>
                  {tag}
                </Badge>
              ))}
          </div>

          </div>

          <p className="line-clamp-none pt-5 text-slate-500 text-base leading-5 font-normal">
            {description}
          </p>
        </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full mb-3">Editar Perfil</Button>
              </DialogTrigger>
              <DialogContent className='w-[420px] p-0'>
                <Modal/>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary" className='w-full mx-[36px] mb-10'>
                        Concluir
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                
              </DialogContent>
            </Dialog>
            <Button variant="dark" className="w-full">Exportar Portifólio</Button>
      </div>
    </div>
  )
}
