import { ProjectCard, type ProjectCardProps } from "./project-card";

export function ProjectCardPreview({
  title,
  author,
  tags,
  description,
  professor,
}: ProjectCardProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className='grid h-4/5 min-w-[1050px] grid-cols-3 items-center justify-center gap-y-5 overflow-hidden'>
        <div className='h-[445px] w-[332px] rounded-xl bg-gradient-to-t from-slate-50 to-slate-200'>
        </div>
        <div className='-mt-[600px] h-[445px] w-[332px] rounded-xl bg-gradient-to-t from-slate-50 to-slate-200'>
        </div>
        <div className='h-[445px] w-[332px] rounded-xl bg-gradient-to-t from-slate-50 to-slate-200'>
        </div>
        <div className=' h-[445px] w-[332px] rounded-xl bg-gradient-to-t from-slate-50 to-slate-200'>
        </div>
        <div className='-mt-[550px]'>
          <ProjectCard
            title={'project.title'}
            author={'project.author'}
            tags={['project.tags', 'project.tags']}
            description={'project.description'}
            professor={'project.professors'}
          />
        </div>
        <div className='h-[445px] w-[332px] rounded-xl bg-gradient-to-t from-slate-50 to-slate-200'>
        </div>
        <div className=' h-[445px] w-[332px] rounded-xl bg-gradient-to-t from-slate-50 to-slate-200'>
        </div>

        <div className=' -mt-[500px] h-[445px] w-[332px] rounded-xl bg-gradient-to-t from-slate-50 to-slate-200'>
        </div>

      </div>
    </div>
  )
}